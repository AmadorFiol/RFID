package com.matgroup.api.service;

import com.matgroup.api.model.Info;
import com.matgroup.api.repository.InfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InfoService {
    private final InfoRepository infoRepository;

    public Optional<Info> findById(Long id) {
        return infoRepository.findById(id);
    }

    public List<Info> findByPedidoId(Long pedidoId) {
        return infoRepository.findByPedidoIdOrderById(pedidoId);
    }

    public Info save(Info info) {
        return infoRepository.save(info);
    }

    public void delete(Long id) {
        infoRepository.deleteById(id);
    }
}
