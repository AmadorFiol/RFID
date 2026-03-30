package com.matgroup.api.repository;

import com.matgroup.api.model.Info;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfoRepository extends JpaRepository<Info, Long> {
    List<Info> findByPedidoIdOrderById(Long pedidoId);
}
