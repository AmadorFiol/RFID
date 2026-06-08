package com.matgroup.api.controller;

import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.model.Lectores;
import com.matgroup.api.service.LectoresService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lectores")
@RequiredArgsConstructor
@CrossOrigin
public class  LectoresController {

    private final LectoresService lectoresService;

    @GetMapping
    public List<Lectores> getAll() {
        return lectoresService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lectores> getByEpc(@PathVariable Long id) {
        return lectoresService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{cif}")
    public ResponseEntity<List<Lectores>> getByUsuario(@PathVariable String cif) {
        List<Lectores> lectoresList = lectoresService.findByUsuario(cif);

        if(lectoresList.isEmpty()){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(lectoresList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @PostMapping
    public ResponseEntity<Lectores> create(@RequestBody Lectores lectores) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lectoresService.save(lectores));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lectores> update(@PathVariable Long id, @RequestBody Lectores lectores) {
        if (lectoresService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        lectores.setId(id);
        return ResponseEntity.ok(lectoresService.save(lectores));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (lectoresService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        lectoresService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

} 
  