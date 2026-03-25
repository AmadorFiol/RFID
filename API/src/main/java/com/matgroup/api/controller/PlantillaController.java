package com.matgroup.api.controller;

import com.matgroup.api.model.Plantilla;
import com.matgroup.api.service.PlantillaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plantillas")
@RequiredArgsConstructor
@CrossOrigin
public class PlantillaController {

    private final PlantillaService plantillaService;

    @GetMapping
    public List<Plantilla> getAll() {
        return plantillaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plantilla> getById(@PathVariable("id") Long id) {
        return plantillaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Plantilla> create(@RequestBody Plantilla plantilla) {
        return ResponseEntity.status(HttpStatus.CREATED).body(plantillaService.save(plantilla));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plantilla> update(@PathVariable("id") Long id, @RequestBody Plantilla plantilla) {
        if (!plantillaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        plantilla.setId(id);
        return ResponseEntity.ok(plantillaService.save(plantilla));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!plantillaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        plantillaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}