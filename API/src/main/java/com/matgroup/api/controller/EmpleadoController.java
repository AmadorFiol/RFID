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

    @GetMapping("/etiqueta/{idEtiqueta}")
    public ResponseEntity<Empleado> getByEtiqueta(@PathVariable("idEtiqueta") String idEtiqueta) {
        return empleadoService.findByEtiqueta(Long.parseLong(idEtiqueta))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Empleado> create(@RequestBody Empleado empleado) {
        return ResponseEntity.status(HttpStatus.CREATED).body(empleadoService.save(empleado));
    }

    @PutMapping("/{dni}")
    public ResponseEntity<Empleado> update(@PathVariable("dni") String dni, @RequestBody Empleado empleado) {
        if (empleadoService.findByDni(dni).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        empleado.setDni(dni);
        return ResponseEntity.ok(empleadoService.save(empleado));
    }

    @DeleteMapping("/{dni}")
    public ResponseEntity<Void> delete(@PathVariable("dni") String dni) {
        if (empleadoService.findByDni(dni).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        empleadoService.deleteByDni(dni);
        return ResponseEntity.noContent().build();
    }
}
