package com.matgroup.api.service;

import com.impinj.octane.*;
import com.matgroup.api.model.TagRead;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RfidReaderService {

    private static final Logger log = LoggerFactory.getLogger(RfidReaderService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ImpinjReader reader = new ImpinjReader();
    private final Map<String, TagRead> tagCache = new ConcurrentHashMap<>();

    @Value("${rfid.reader.hostname}")
    private String hostname;

    @Value("${rfid.reader.tx-power-dbm}")
    private double txPowerDbm;

    @Value("${rfid.reader.rx-sensitivity-dbm}")
    private double rxSensitivityDbm;

    @Value("${rfid.reader.antennas}")
    private String antennasCsv;

    private volatile boolean reading = false;

    public RfidReaderService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public synchronized void startReading() throws OctaneSdkException {
        if (reading) {
            log.warn("Ya hay una lectura activa.");
            return;
        }

        log.info("Conectando al reader {}", hostname);
        if (!reader.isConnected()) {
            reader.connect(hostname);
        }

        // 1. Partir de los settings por defecto del reader
        Settings settings = reader.queryDefaultSettings();

        // 2. Configurar qué queremos que informe el reader en cada reporte
        ReportConfig report = settings.getReport();
        report.setIncludeAntennaPortNumber(true);
        report.setIncludePeakRssi(true);
        report.setIncludeFirstSeenTime(true);
        report.setIncludeLastSeenTime(true);
        report.setIncludeSeenCount(true);
        report.setMode(ReportMode.Individual); // un reporte por tag detectada

        // 3. Configurar antenas: desactivar todas y luego activar las indicadas
        AntennaConfigGroup antennas = settings.getAntennas();
        antennas.disableAll();
        for (String a : antennasCsv.split(",")) {
            short port = Short.parseShort(a.trim());
            antennas.getAntenna(port).setEnabled(true);
            antennas.getAntenna(port).setIsMaxTxPower(false);
            antennas.getAntenna(port).setTxPowerinDbm(txPowerDbm);
            antennas.getAntenna(port).setIsMaxRxSensitivity(false);
            antennas.getAntenna(port).setRxSensitivityinDbm(rxSensitivityDbm);
        }

        // 4. Modo de búsqueda: DualTarget funciona bien para inventario continuo
        settings.setSearchMode(SearchMode.DualTarget);
        settings.setSession(1);

        // 5. Listener que recibe cada reporte del reader
        reader.setTagReportListener((ImpinjReader r, TagReport tagReport) -> {
            for (Tag tag : tagReport.getTags()) {
                String epc = tag.getEpc().toHexString();
                int seenThisReport = tag.getTagSeenCount();
                long firstSeenNow = tag.getFirstSeenTime().getLocalDateTime().getTime();
                long lastSeenNow  = tag.getLastSeenTime().getLocalDateTime().getTime();
                double rssiNow    = tag.getPeakRssiInDbm();
                int antennaNow    = tag.getAntennaPortNumber();

                TagRead merged = tagCache.merge(
                        epc,
                        TagRead.of(epc, antennaNow, rssiNow,
                                firstSeenNow, lastSeenNow, seenThisReport, hostname),
                        (prev, fresh) -> TagRead.of(
                                epc,
                                fresh.antennaPort(),                       // antena más reciente
                                fresh.rssi(),                              // RSSI más reciente
                                Math.min(prev.firstSeen(), fresh.firstSeen()), // primer avistamiento
                                Math.max(prev.lastSeen(),  fresh.lastSeen()),  // último avistamiento
                                prev.readCount() + fresh.readCount(),      // ¡aquí acumulamos!
                                hostname
                        )
                );

                messagingTemplate.convertAndSend("/topic/tags", merged);
            }
        });

        // 6. Aplicar y arrancar
        reader.applySettings(settings);
        reader.start();
        reading = true;
        log.info("Lectura iniciada.");
    }

    public synchronized void stopReading() throws OctaneSdkException {
        if (!reading) return;
        reader.stop();
        if (reader.isConnected()) {
            reader.disconnect();
        }
        reading = false;
        log.info("Lectura detenida.");
    }

    public boolean isReading() {
        return reading;
    }

    public Map<String, TagRead> getCurrentTags() {
        return Map.copyOf(tagCache);
    }

    public void clearCache() {
        tagCache.clear();
    }

    @PreDestroy
    public void shutdown() {
        try {
            stopReading();
        } catch (Exception e) {
            log.error("Error al cerrar el reader", e);
        }
    }
}