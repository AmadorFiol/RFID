package com.matgroup.api.controller;

import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.model.Pagina;
import com.matgroup.api.service.PaginaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/paginas")
@RequiredArgsConstructor
@CrossOrigin
public class PaginaController {

    private final PaginaService paginaService;

    @GetMapping
    public List<Pagina> getAll() {
        return paginaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pagina> getById(@PathVariable("id") Long id) {
        return paginaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Pagina>> getByUsuario(@PathVariable("idUsuario") String idUsuario) {
        List<Pagina> paginaList = paginaService.findByUsuario(idUsuario);

        if(paginaList.size()<1){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(paginaList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @PostMapping
    public ResponseEntity<Pagina> create(@RequestBody Pagina pagina) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paginaService.save(pagina));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pagina> update(@PathVariable("id") Long id, @RequestBody Pagina pagina) {
        if (!paginaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        pagina.setId(id);
        return ResponseEntity.ok(paginaService.save(pagina));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!paginaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        paginaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
