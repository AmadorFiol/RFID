package com.matgroup.api.repository;

import com.matgroup.api.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByUsuarioCifOrderById(String usuarioCif);

    Cliente findByUsuarioCifAndNombre(String usuarioCif, String nombre);
}
