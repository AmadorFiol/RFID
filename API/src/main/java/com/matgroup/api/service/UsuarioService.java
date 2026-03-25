package com.matgroup.api.service;

import com.matgroup.api.model.Usuario;
import com.matgroup.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll(Sort.by("cif"));
    }

    public Optional<Usuario> findById(String cif) {
        return usuarioRepository.findById(cif);
    }

    public Optional<Usuario> login(String email, String password) {
        return Optional.ofNullable(usuarioRepository.findByEmailAndPassword(email, password));
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void deleteById(String cif) {
        usuarioRepository.deleteById(cif);
    }
}


