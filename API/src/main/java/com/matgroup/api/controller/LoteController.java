package com.matgroup.api.controller;

import com.matgroup.api.model.Lote;
import com.matgroup.api.service.LoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lotes")
@RequiredArgsConstructor
public class LoteController {

    private final LoteService loteService;

    @GetMapping
    public List<Lote> getAll() {
        return loteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lote> getById(@PathVariable Long id) {
        return loteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lote> create(@RequestBody Lote lote) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loteService.save(lote));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lote> update(@PathVariable Long id, @RequestBody Lote lote) {
        if (!loteService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        lote.setId(id);
        return ResponseEntity.ok(loteService.save(lote));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!loteService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        loteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
