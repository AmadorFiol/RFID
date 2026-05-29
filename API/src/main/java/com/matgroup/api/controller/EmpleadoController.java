package com.matgroup.api.controller;

import com.matgroup.api.model.Empleado;
import com.matgroup.api.service.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
@CrossOrigin
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    @GetMapping
    public List<Empleado> getAll() {
        return empleadoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> getById(@PathVariable("id") Long id) {
        return empleadoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUser}")
    public ResponseEntity<List<Empleado>> getByUsuario(@PathVariable("idUser") String idUser) {
        List<Empleado> empleadoList = empleadoService.findByUsuario(idUser);

        if(empleadoList.isEmpty()){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(empleadoList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @PostMapping
    public ResponseEntity<Empleado> create(@RequestBody Empleado empleado) {
        return ResponseEntity.status(HttpStatus.CREATED).body(empleadoService.save(empleado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empleado> update(@PathVariable("id") Long id, @RequestBody Empleado empleado) {
        if (empleadoService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        empleado.setId(id);
        return ResponseEntity.ok(empleadoService.save(empleado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (empleadoService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        empleadoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
