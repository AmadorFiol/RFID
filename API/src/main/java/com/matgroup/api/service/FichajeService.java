package com.matgroup.api.service;

import com.matgroup.api.model.Fichaje;
import com.matgroup.api.repository.FichajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FichajeService {

    private final FichajeRepository fichajeRepository;

    public List<Fichaje> findAll() {
        return fichajeRepository.findAll(Sort.by("id"));
    }

    public Optional<Fichaje> findById(Long id) {
        return fichajeRepository.findById(id);
    }

    public List<Fichaje> findByEmpleado(String empleadoDni) {
        return fichajeRepository.findByEmpleadoDniOrderById(empleadoDni);
    }

    public Optional<Fichaje> findLast(String empleadoDni) {
        return fichajeRepository.findByEmpleadoDniLast(empleadoDni);
    }

    public Fichaje save(Fichaje fichaje) {
        return fichajeRepository.save(fichaje);
    }

    public void deleteById(Long id) {
        fichajeRepository.deleteById(id);
    }
}
