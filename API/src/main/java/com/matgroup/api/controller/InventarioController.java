package com.matgroup.api.controller;

import com.matgroup.api.model.Inventario;
import com.matgroup.api.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventarios")
@RequiredArgsConstructor
@CrossOrigin
public class InventarioController {

    private final InventarioService inventarioService;

    @GetMapping
    public List<Inventario> getAll() {
        return inventarioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventario> getById(@PathVariable("id") Long id) {
        return inventarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Inventario> create(@RequestBody Inventario inventario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventarioService.save(inventario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventario> update(@PathVariable("id") Long id, @RequestBody Inventario inventario) {
        if (!inventarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        inventario.setId(id);
        return ResponseEntity.ok(inventarioService.save(inventario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!inventarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        inventarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
