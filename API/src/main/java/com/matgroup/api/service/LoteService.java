package com.matgroup.api.service;

import com.matgroup.api.model.Lote;
import com.matgroup.api.repository.LoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoteService {

    private final LoteRepository loteRepository;

    public List<Lote> findAll() {
        return loteRepository.findAll();
    }

    public Optional<Lote> findById(Long id) {
        return loteRepository.findById(id);
    }

    public Lote save(Lote lote) {
        return loteRepository.save(lote);
    }

    public void deleteById(Long id) {
        loteRepository.deleteById(id);
    }
}
