package com.matgroup.api.controller;

import com.matgroup.api.model.Fichaje;
import com.matgroup.api.service.RfidFichajeService;
import com.matgroup.api.service.FichajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/fichajes")
@RequiredArgsConstructor
@CrossOrigin
public class FichajeController {

    private final FichajeService fichajeService;

    @GetMapping
    public List<Fichaje> getAll() {
        return fichajeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fichaje> getById(@PathVariable("id") Long id) {
        return fichajeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/empleado/{idEmpleado}")
    public ResponseEntity<List<Fichaje>> getByEmpleado(@PathVariable("idEmpleado") String idEmpleado) {
        List<Fichaje> fichajeList = fichajeService.findByEmpleado(idEmpleado);

        if(fichajeList.isEmpty()){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(fichajeList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @PostMapping
    public ResponseEntity<Fichaje> create(@RequestBody Fichaje fichaje) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fichajeService.save(fichaje));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fichaje> update(@PathVariable("id") Long id, @RequestBody Fichaje fichaje) {
        if (fichajeService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        fichaje.setId(id);
        return ResponseEntity.ok(fichajeService.save(fichaje));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (fichajeService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        fichajeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoints rfid service
    private final RfidFichajeService rfidFichajeService;

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of("reading", rfidFichajeService.isReading());
    }

    @PostMapping("/start")
    public Map<String, Object> start() throws Exception {
        rfidFichajeService.startReading();
        return Map.of("status", "started");
    }

    @PostMapping("/stop")
    public Map<String, Object> stop() throws Exception {
        rfidFichajeService.stopReading();
        return Map.of("status", "stopped");
    }
}
