package com.matgroup.api.repository;

import com.matgroup.api.model.Cliente;
import com.matgroup.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    Usuario findByEmailAndPassword(String email, String password);
}

