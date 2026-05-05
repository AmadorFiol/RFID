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

    @GetMapping("/{epc}")
    public ResponseEntity<Etiqueta> getByEpc(@PathVariable String epc) {
        return etiquetaService.findByEpc(epc)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Etiqueta>> getByUsuario(@PathVariable String idUsuario) {
        List<Etiqueta> etiquetaList = etiquetaService.findByUsuario(idUsuario);

        if(etiquetaList.isEmpty()){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(etiquetaList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @GetMapping("/{epc}/{tid}")
    public ResponseEntity<Etiqueta> getByEpcAndTid(@PathVariable String epc, @PathVariable String tid) {
        Etiqueta etiqueta = etiquetaService.findByEpcAndTid(epc,tid);
        if(etiqueta==null){
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(etiqueta);
        }
    }

    @PostMapping
    public ResponseEntity<Etiqueta> create(@RequestBody Etiqueta etiqueta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(etiquetaService.save(etiqueta));
    }

    @PutMapping("/{epc}")
    public ResponseEntity<Etiqueta> update(@PathVariable String epc, @RequestBody Etiqueta etiqueta) {
        if (etiquetaService.findByEpc(epc).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        etiqueta.setEpc(epc);
        return ResponseEntity.ok(etiquetaService.save(etiqueta));
    }

    @DeleteMapping("/{epc}")
    public ResponseEntity<Void> delete(@PathVariable String epc) {
        if (etiquetaService.findByEpc(epc).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        etiquetaService.deleteByEpc(epc);
        return ResponseEntity.noContent().build();
    }
}
