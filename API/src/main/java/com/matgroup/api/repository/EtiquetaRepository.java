package com.matgroup.api.repository;

import com.matgroup.api.model.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtiquetaRepository extends JpaRepository<Etiqueta, Long> {

    List<Etiqueta> findByClienteCif(String cif);

    List<Etiqueta> findByLoteId(Long idLote);
}
