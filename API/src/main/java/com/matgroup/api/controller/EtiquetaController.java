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
@CrossOrigin
public class EtiquetaController {

    private final EtiquetaService etiquetaService;

    @GetMapping
    public List<Etiqueta> getAll() {
        return etiquetaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etiqueta> getById(@PathVariable("id") Long id) {
        return etiquetaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Etiqueta>> getByCliente(@PathVariable("idCliente") Long idCliente) {
        List<Etiqueta> etiquetaList = etiquetaService.findByCliente(idCliente);

        if(etiquetaList.size()<1){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(etiquetaList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @GetMapping("/lote/{idLote}")
    public ResponseEntity<List<Etiqueta>> getByLote(@PathVariable("idLote") Long idLote) {
        List<Etiqueta> etiquetaList = etiquetaService.findByLote(idLote);

        if(etiquetaList.size()<1){
            return ResponseEntity.notFound().build();
        }else{
        return Optional.of(etiquetaList)
                .map(ResponseEntity::ok)
                .orElse(null);
        }
    }

    @GetMapping("/inventario/{idInventario}")
    public ResponseEntity<List<Etiqueta>> getByInventario(@PathVariable("idInventario") Long idInventario) {
        List<Etiqueta> etiquetaList = etiquetaService.findByInventario(idInventario);

        if(etiquetaList.size()<1){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(etiquetaList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Etiqueta>> getByUsuario(@PathVariable("idUsuario") String idUsuario) {
        List<Etiqueta> etiquetaList = etiquetaService.findByUsuario(idUsuario);

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
    public ResponseEntity<Etiqueta> update(@PathVariable("id") Long id, @RequestBody Etiqueta etiqueta) {
        if (!etiquetaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        etiqueta.setId(id);
        return ResponseEntity.ok(etiquetaService.save(etiqueta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!etiquetaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        etiquetaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
