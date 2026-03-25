package com.matgroup.api.service;

import com.matgroup.api.model.Pedido;
import com.matgroup.api.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoRepository pedidoRepository;

    public List<Pedido> findAll() {
        return pedidoRepository.findAll(Sort.by("id"));
    }

    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }

    public List<Pedido> findByUsuario(String idUsuario) {
        return pedidoRepository.findByUsuarioIdOrderById(idUsuario);
    }

    public Pedido save(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void deleteById(Long id) {
        pedidoRepository.deleteById(id);
    }
}
