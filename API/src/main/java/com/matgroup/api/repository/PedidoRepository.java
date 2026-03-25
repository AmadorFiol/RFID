package com.matgroup.api.repository;

import com.matgroup.api.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    @Query(value = "SELECT pe.* " +
            "FROM \"pedido\" pe " +
            "JOIN \"plantilla\" pl ON pe.id_plantilla=pl.id " +
            "JOIN \"usuario\" u ON pl.id_usuario=u.cif " +
            "WHERE u.cif=?1  " +
            "ORDER BY pe.id",
            nativeQuery = true
    )
    List<Pedido> findByUsuarioIdOrderById(String idUsuario);
}
