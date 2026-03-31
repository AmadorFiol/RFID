package com.matgroup.api.service;

import com.matgroup.api.model.Plantilla;
import com.matgroup.api.repository.PlantillaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlantillaService {
    private final PlantillaRepository plantillaRepository;

    public List<Plantilla> findAll() {
        return plantillaRepository.findAll(Sort.by("id"));
    }

    public Optional<Plantilla> findById(Long id) {
        return plantillaRepository.findById(id);
    }

    public List<Plantilla> findByUsuarioId(String cif) {
        return plantillaRepository.findByUsuarioCifOrderById(cif);
    }

    public Plantilla save(Plantilla plantilla) {
        return plantillaRepository.save(plantilla);
    }

    public void deleteById(Long id) {
        plantillaRepository.deleteById(id);
    }
}
