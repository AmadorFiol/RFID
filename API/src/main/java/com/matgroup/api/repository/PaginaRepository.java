package com.matgroup.api.repository;

import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.model.Pagina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaginaRepository extends JpaRepository<Pagina, Long> {
    @Query(value = "SELECT e.*" +
            "FROM \"pagina\" e " +
            "JOIN \"rol\" c ON e.id_rol=c.id " +
            "JOIN \"usuario\" u ON c.id_usuario=u.cif " +
            "WHERE u.cif=?1  " +
            "ORDER BY e.id",
            nativeQuery = true
    )
    List<Pagina> findByUsuarioId(String idUsuario);
}
