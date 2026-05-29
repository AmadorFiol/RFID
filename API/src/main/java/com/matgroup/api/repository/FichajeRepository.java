package com.matgroup.api.repository;

import com.matgroup.api.model.Fichaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FichajeRepository extends JpaRepository<Fichaje, Long> {
    List<Fichaje> findByEmpleadoIdOrderById(Long empleado_id);
}
