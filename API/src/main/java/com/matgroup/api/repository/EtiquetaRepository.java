package com.matgroup.api.repository;

import com.matgroup.api.model.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtiquetaRepository extends JpaRepository<Etiqueta, Long> {

    List<Etiqueta> findByClienteId(Long idCliente);

    List<Etiqueta> findByLoteId(Long idLote);

    List<Etiqueta> findByInventarioId(Long idInventario);

    @Query(value = "SELECT e.id, e.id_lote, e.codigo, e.id_inventario, e.estado, e.id_cliente " +
            "FROM \"etiqueta\" e " +
            "JOIN \"cliente\" c ON e.id_cliente=c.id " +
            "JOIN \"usuario\" u ON c.id_usuario=u.cif " +
            "WHERE u.cif=?1  " +
            "ORDER BY e.id",
            nativeQuery = true
    )
    List<Etiqueta> findByUsuarioId(String idUsuario);
}
