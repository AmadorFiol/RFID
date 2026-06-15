package com.matgroup.api.repository;

import com.matgroup.api.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    List<Empleado> findByUsuarioCifOrderByDni(String usuarioCif);

    Optional<Empleado> findByEtiquetaIid(Long etiquetaIid);

    Optional<Empleado> findByDni(String dni);

    void deleteByDni(String dni);
}
