package com.matgroup.api.controller;

import com.matgroup.api.model.Cliente;
import com.matgroup.api.model.Usuario;
import com.matgroup.api.service.ClienteService;
import com.matgroup.api.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ClienteService clienteService;

    @GetMapping
    public List<Usuario> getAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{cif}")
    public ResponseEntity<Usuario> getById(@PathVariable("cif") String cif) {
        return usuarioService.findById(cif)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario) {
        Cliente cliente = new Cliente();
        cliente.setNombre("[Sin Asignar]");
        Usuario savedUser = usuarioService.save(usuario);
        cliente.setUsuario(savedUser);
        clienteService.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PutMapping("/{cif}")
    public ResponseEntity<Usuario> update(@PathVariable("cif") String cif, @RequestBody Usuario usuario) {
        if (!usuarioService.findById(cif).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        usuario.setCif(cif);
        return ResponseEntity.ok(usuarioService.save(usuario));
    }

    @DeleteMapping("/{cif}")
    public ResponseEntity<Void> delete(@PathVariable("cif") String cif) {
        if (!usuarioService.findById(cif).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.deleteById(cif);
        return ResponseEntity.noContent().build();
    }
}
