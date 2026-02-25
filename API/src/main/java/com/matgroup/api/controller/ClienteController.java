package com.matgroup.api.controller;

import com.matgroup.api.model.Cliente;
import com.matgroup.api.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public List<Cliente> getAll() {
        return clienteService.findAll();
    }

    @GetMapping("/{cif}")
    public ResponseEntity<Cliente> getById(@PathVariable String cif) {
        return clienteService.findById(cif)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody Cliente cliente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.save(cliente));
    }

    @PutMapping("/{cif}")
    public ResponseEntity<Cliente> update(@PathVariable String cif, @RequestBody Cliente cliente) {
        if (!clienteService.findById(cif).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        cliente.setCif(cif);
        return ResponseEntity.ok(clienteService.save(cliente));
    }

    @DeleteMapping("/{cif}")
    public ResponseEntity<Void> delete(@PathVariable String cif) {
        if (!clienteService.findById(cif).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        clienteService.deleteById(cif);
        return ResponseEntity.noContent().build();
    }
}
