package com.matgroup.api.repository;

import com.matgroup.api.model.Lectores;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectoresRepository extends JpaRepository<Lectores, Long>{
    List<Lectores> findByUsuarioCifOrderById(String usuarioCif);
}

