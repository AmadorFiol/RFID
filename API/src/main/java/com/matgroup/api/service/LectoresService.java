package com.matgroup.api.service;

import com.matgroup.api.model.Lectores;
import com.matgroup.api.repository.LectoresRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LectoresService{

    private final LectoresRepository lectoresRepository;

    public List<Lectores> findAll() {
        return lectoresRepository.findAll(Sort.by("usuarioCif"));
    }

    public Optional<Lectores> findById(Long id) {
        return lectoresRepository.findById(id);
    }

    public List<Lectores> findByUsuario(String usuarioCif) {
        return lectoresRepository.findByUsuarioCifOrderById(usuarioCif);
    }

    public Lectores save(Lectores lectores) {
        return lectoresRepository.save(lectores);
    }

    public void deleteById(Long id) {
        lectoresRepository.deleteById(id);
    }
}

