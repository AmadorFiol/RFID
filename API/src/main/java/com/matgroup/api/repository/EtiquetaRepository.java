package com.matgroup.api.repository;

import com.matgroup.api.model.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtiquetaRepository extends JpaRepository<Etiqueta, Long> {

    @Query(value = "SELECT e.* " +
            "FROM \"etiqueta\" e " +
            "JOIN \"cliente\" c ON e.id_cliente=c.id " +
            "JOIN \"usuario\" u ON c.id_usuario=u.cif " +
            "WHERE u.cif=?1  " +
            "ORDER BY e.epc",
            nativeQuery = true
    )
    List<Etiqueta> findByUsuarioIdOrderById(String idUsuario);

    Etiqueta findByEpcAndTid(String epc, String tid);

    Optional<Etiqueta> findByEpc(String epc);

    void deleteByEpc(String epc);
}
