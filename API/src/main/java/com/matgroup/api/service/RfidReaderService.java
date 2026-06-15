package com.matgroup.api.service;

import com.impinj.octane.*;
import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.model.TagRead;
import jakarta.annotation.PreDestroy;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.*;

@Service
public class RfidReaderService {

    private static final Logger log = LoggerFactory.getLogger(RfidReaderService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ImpinjReader reader = new ImpinjReader();
    private final Map<String, TagRead> tagCache = new ConcurrentHashMap<>();
    private final EtiquetaService etiquetaService;

    // Reportes periodicos
    private final Set<String> pendingUpdates = ConcurrentHashMap.newKeySet();
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

    @Getter
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
        settings.setRfMode(1002);
        settings.setSearchMode(SearchMode.DualTarget);
        settings.setSession(1);
        settings.setTagPopulationEstimate(32);

        // 5. Listener que recibe cada reporte del reader
        reader.setTagReportListener((ImpinjReader r, TagReport tagReport) -> {
            for (Tag tag : tagReport.getTags()) {
                String epc          = tag.getEpc().toHexString();
                String tid          = tag.getTid().toHexString();
                Optional<Etiqueta> etiqueta = etiquetaService.findByEpc(tag.getEpc().toHexString());
                String alias        = etiqueta.isPresent()? etiqueta.get().getAlias():"";
                String tagModel     = tag.getModelDetails().getModelName().toString();
                long lastSeen       = tag.getLastSeenTime().getLocalDateTime().getTime();
                int antennaNow      = tag.getAntennaPortNumber();
                boolean alertar     = etiqueta.map(Etiqueta::isAlertar).orElse(false);

                tagCache.merge(
                        epc,
                        TagRead.of(epc, tid, alias, tagModel, antennaNow, lastSeen, hostname, alertar),
                        (prev, fresh) -> TagRead.of(
                                epc,
                                tid,
                                alias,
                                tagModel,
                                fresh.lastSeen()-prev.lastSeen()>=10000?
                                        fresh.antennaPort():prev.antennaPort(), // Cambio la antena/location cada 10 s
                                fresh.lastSeen()-prev.lastSeen()>=10000?
                                        fresh.lastSeen():prev.lastSeen(),       // Actualizo "ultima" vista cada 10s
                                hostname,                                       // Nombre del lector
                                alertar
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

            //Revisamos aquellas que lleven 30s sin aparecer
            long now = (new Date()).getTime();
            Map<String, TagRead> oldTagCache = new ConcurrentHashMap<>(tagCache);
            for (TagRead tr : oldTagCache.values()) {
                long timeSinceLastSeen = now-tr.lastSeen();

                if(tr.epc().equals("060196000000000000000E03")) {
                    System.out.println("     Now     : " + now);
                    System.out.println("  Last seen  : " + tr.lastSeen());
                    System.out.println("Time since LS: " + timeSinceLastSeen);
                }
                /*
                    Init gap:       Now - LastSeen
                    Init gap parece rondar los -3.740.000, pero no es fijo
                    Pq la resta me da un número tan grande, y pq es negativo?
                    Pq Now es menor que LastSeen si se establece después?
                    28/05: Ahora Init gap ronda los -3,750M, pq el núm. es más grande??
                    29/05: Ahora está en los -3,760M, PORQUEEEEEEEEEEEEEE
                           El próximo lunes estará en los 3,790M entonces????
                    01/06: Ha vuelto a los -3,750M..., está bien que baje, pero pq lo hizó??
                    02/06: Hoy ha vuelto a subir en 10k, pq bajo entonces durante el finde??
                    03/06: Ha vuelto a subir en 10k, a partir de hoy si solo hace eso no habrá reporte diario
                    05/06: Hoy ronda los -3,800M peró era de esperar por el aumento de 10k

                    Trigger gap:    Init gap + 30k
                    Para obtener Trigger gap si se sigue la lógica de estar en ms
                */

                if (tr.alertar() && tr.antennaPort()!=4 && timeSinceLastSeen >= 30000) {
                    tagCache.replace(tr.epc(),new TagRead(
                            tr.epc(),
                            tr.tid(),
                            tr.alias(),
                            tr.tagModel(),
                            4,
                            tr.lastSeen(),
                            tr.readerHostname(),
                            true
                    ));
                    pendingUpdates.add(tr.epc());
                }
            }

            // Snapshot atómico: copiamos y vaciamos el set
            List<String> epcsToSend = new ArrayList<>(pendingUpdates);
            epcsToSend.forEach(pendingUpdates::remove);

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