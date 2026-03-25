package com.matgroup.api.repository;

import com.matgroup.api.model.Pagina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaginaRepository extends JpaRepository<Pagina, Long> {

    List<Pagina> findByRolIdOrderByNombre(Long rolId);
}
