package com.matgroup.api.service;

import com.impinj.octane.*;
import com.matgroup.api.model.TagRead;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;

@Service
public class RfidReaderService {

    private static final Logger log = LoggerFactory.getLogger(RfidReaderService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ImpinjReader reader = new ImpinjReader();
    private final Map<String, TagRead> tagCache = new ConcurrentHashMap<>();

    // Reportes periodicos
    private final Set<String> pendingUpdates = ConcurrentHashMap.newKeySet();
    private final EtiquetaService etiquetaService;
    private ScheduledExecutorService scheduler;
    private ScheduledFuture<?> flushTask;

    @Value("${rfid.reader.hostname}")
    private String hostname;

    @Value("${rfid.reader.tx-power-dbm}")
    private double txPowerDbm;

    @Value("${rfid.reader.rx-sensitivity-dbm}")
    private double rxSensitivityDbm;

    @Value("${rfid.reader.antennas}")
    private String antennasCsv;

    @Value("${rfid.reader.report-interval-ms}")
    private long reportIntervalMs;

    private volatile boolean reading = false;

    public RfidReaderService(SimpMessagingTemplate messagingTemplate, EtiquetaService etiquetaService) {
        this.messagingTemplate = messagingTemplate;
        this.etiquetaService = etiquetaService;
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
        report.setIncludeFastId(true);
        report.setIncludeAntennaPortNumber(true);
        report.setIncludePeakRssi(true);
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
                String epc          = tag.getEpc().toHexString();
                String tid          = tag.getTid().toHexString();
                String alias        = (etiquetaService.findByEpc(tag.getEpc().toHexString()).get().getAlias());
                int seenThisReport  = tag.getTagSeenCount();
                long lastSeenNow    = tag.getLastSeenTime().getLocalDateTime().getTime();
                double rssiNow      = tag.getPeakRssiInDbm();
                int antennaNow      = tag.getAntennaPortNumber();

                tagCache.merge(
                        epc,
                        TagRead.of(epc, tid, alias, antennaNow, rssiNow, lastSeenNow, seenThisReport, hostname),
                        (prev, fresh) -> TagRead.of(
                                epc,                                            // EPC
                                tid,                                            // TID
                                alias,                                          // Alias
                                fresh.antennaPort(),                            // Antena más reciente
                                fresh.rssi(),                                   // RSSI más reciente
                                Math.max(prev.lastSeen(), fresh.lastSeen()),    // Ultimo avistamiento
                                prev.readCount() + fresh.readCount(),           // Contador de veces visto
                                hostname                                        // Nombre del lector
                        )
                );

                pendingUpdates.add(epc);
            }
        });

        // 6. Aplicar y arrancar
        reader.applySettings(settings);
        reader.start();

        // Arranca el scheduler de flush periódico
        scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "rfid-flush");
            t.setDaemon(true);
            return t;
        });
        flushTask = scheduler.scheduleAtFixedRate(
                this::flushPendingUpdates,
                reportIntervalMs,
                reportIntervalMs,
                TimeUnit.MILLISECONDS
        );

        reading = true;
        log.info("Lectura iniciada.");
    }

    private void flushPendingUpdates() {
        try {
            if (pendingUpdates.isEmpty()) return;

            // Snapshot atómico: copiamos y vaciamos el set
            List<String> epcsToSend = new ArrayList<>(pendingUpdates);
            pendingUpdates.removeAll(epcsToSend);

            List<TagRead> snapshot = new ArrayList<>(epcsToSend.size());
            for (String epc : epcsToSend) {
                TagRead tr = tagCache.get(epc);
                if (tr != null) snapshot.add(tr);
            }

            if (!snapshot.isEmpty()) {
                messagingTemplate.convertAndSend("/topic/tags", snapshot);
            }
        } catch (Exception e) {
            log.error("Error en flush periódico", e);
        }
    }

    public synchronized void stopReading() throws OctaneSdkException {
        if (!reading) return;

        if (flushTask != null) flushTask.cancel(false);
        if (scheduler != null) scheduler.shutdown();

        // Flush final por si quedaron lecturas pendientes
        flushPendingUpdates();

        reader.stop();
        if (reader.isConnected()) reader.disconnect();
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
        pendingUpdates.clear();
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