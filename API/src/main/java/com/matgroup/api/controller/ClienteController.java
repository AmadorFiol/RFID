package com.matgroup.api.controller;

import com.matgroup.api.model.Cliente;
import com.matgroup.api.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public List<Cliente> getAll() {
        return clienteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getById(@PathVariable("id") Long id) {
        return clienteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUser}")
    public ResponseEntity<List<Cliente>> getByUsuario(@PathVariable("idUser") String idUser) {
        List<Cliente> clienteList = clienteService.findByUsuario(idUser);

        if(clienteList.size()<1){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(clienteList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @GetMapping("/usuario/{idUser}/default")
    public ResponseEntity<List<Cliente>> getDefault(@PathVariable("idUser") String idUser) {
        List<Cliente> clienteList = clienteService.findDefault(idUser);

        if(clienteList.size()<1){
            return ResponseEntity.notFound().build();
        }else{
            return Optional.of(clienteList)
                    .map(ResponseEntity::ok)
                    .orElse(null);
        }
    }

    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody Cliente cliente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.save(cliente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> update(@PathVariable("id") Long id, @RequestBody Cliente cliente) {
        if (!clienteService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        cliente.setId(id);
        return ResponseEntity.ok(clienteService.save(cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!clienteService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
