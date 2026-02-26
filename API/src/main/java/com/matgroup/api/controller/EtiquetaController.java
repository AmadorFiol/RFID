package com.matgroup.api.controller;

import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.service.EtiquetaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etiquetas")
@RequiredArgsConstructor
public class EtiquetaController {

    private final EtiquetaService etiquetaService;

    @GetMapping
    public List<Etiqueta> getAll() {
        return etiquetaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etiqueta> getById(@PathVariable Long id) {
        return etiquetaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{cif}")
    public ResponseEntity<List<Etiqueta>> getByCliente(@PathVariable String cif) {
        List<Etiqueta> etiquetaList = etiquetaService.findByCliente(cif);

        if(etiquetaList.size()<1){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(etiquetaList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @GetMapping("/lote/{idLote}")
    public ResponseEntity<List<Etiqueta>> getByLote(@PathVariable Long idLote) {
        List<Etiqueta> etiquetaList = etiquetaService.findByLote(idLote);

        if(etiquetaList.size()<1){
            return ResponseEntity.notFound().build();
        }else{
        return Optional.of(etiquetaList)
                .map(ResponseEntity::ok)
                .orElse(null);
        }
    }

    @PostMapping
    public ResponseEntity<Etiqueta> create(@RequestBody Etiqueta etiqueta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(etiquetaService.save(etiqueta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etiqueta> update(@PathVariable Long id, @RequestBody Etiqueta etiqueta) {
        if (!etiquetaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        etiqueta.setId(id);
        return ResponseEntity.ok(etiquetaService.save(etiqueta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!etiquetaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        etiquetaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
