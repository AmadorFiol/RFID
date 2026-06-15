package com.matgroup.api.service;


import com.impinj.octane.*;
import com.matgroup.api.model.Empleado;
import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.model.Fichaje;
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
public class RfidFichajeService {
    private static final Logger log = LoggerFactory.getLogger(RfidReaderService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ImpinjReader reader = new ImpinjReader();
    private final Map<String, Long> tagCache = new ConcurrentHashMap<>();
    private final EtiquetaService etiquetaService;
    private final EmpleadoService empleadoService;
    private final FichajeService fichajeService;

    // Reportes periodicos
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

    public RfidFichajeService(SimpMessagingTemplate messagingTemplate, EtiquetaService etiquetaService, EmpleadoService empleadoService, FichajeService fichajeService) {
        this.messagingTemplate = messagingTemplate;
        this.etiquetaService = etiquetaService;
        this.empleadoService = empleadoService;
        this.fichajeService = fichajeService;
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
                tagCache.merge(
                    tag.getEpc().toHexString(),
                    tag.getLastSeenTime().getLocalDateTime().getTime(),
                    (prev, fresh) -> {
                        // Compruebo si han pasado 10s desde la "última" vez vista
                        if(fresh-prev>=10000){
                            //Sí han pasado los Xs se crea el nuevo fichaje
                            Optional<Etiqueta> etiqueta = etiquetaService.findByEpc(tag.getEpc().toHexString());
                            Optional<Empleado> empleado = empleadoService.findByEtiqueta(etiqueta.get().getIid());
                            if(empleado.isPresent()) {
                                Optional<Fichaje> lastFichaje = fichajeService.findLast(empleado.get().getDni());
                                Fichaje newFichaje = new  Fichaje(empleado.get(), lastFichaje.map(fichaje -> !fichaje.getEntrada()).orElse(true));
                                fichajeService.save(newFichaje);
                            }

                            //Además de actualizar la "última" vez vista
                            return fresh;
                        } else {
                            // Si no han pasado los Xs no se actualiza
                            return prev;
                        }
                    }
                );
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

            messagingTemplate.convertAndSend("/topic/fichaje", "heartbeat");
        } catch (Exception e) {
            log.error("Error en flush periódico", e);
        }
    }

    public synchronized void stopReading() throws OctaneSdkException {
        if (!reading) return;

        if (flushTask != null) flushTask.cancel(false);
        if (scheduler != null) scheduler.shutdown();

        reader.stop();
        if (reader.isConnected()) reader.disconnect();
        reading = false;
        log.info("Lectura detenida.");
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
