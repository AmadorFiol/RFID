package com.matgroup.api.repository;

import com.matgroup.api.model.Plantilla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantillaRepository extends JpaRepository<Plantilla, Long> {
    List<Plantilla> findByUsuarioCifOrderById(String cif);
}
