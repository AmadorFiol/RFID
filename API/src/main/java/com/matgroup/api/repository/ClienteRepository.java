package com.matgroup.api.repository;

import com.matgroup.api.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByUsuarioCif(String usuarioCif);

    List<Cliente> findByUsuarioCifAndNombre(String usuarioCif, String nombre);
}
