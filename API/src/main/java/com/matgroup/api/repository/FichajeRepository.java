package com.matgroup.api.repository;

import com.matgroup.api.model.Fichaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FichajeRepository extends JpaRepository<Fichaje, Long> {
    List<Fichaje> findByEmpleadoDniOrderById(String empleadoDni);

    @Query(value = "SELECT f.* " +
            "FROM \"fichaje\" f " +
            "JOIN \"empleado\" e ON f.id_empleado = e.dni " +
            "WHERE e.dni=?1 " +
            "ORDER BY f.id DESC " +
            "LIMIT 1",
            nativeQuery = true
    )
    Optional<Fichaje> findByEmpleadoDniLast(String empleadoDni);
}
