package com.matgroup.api.service;

import com.matgroup.api.model.Pagina;
import com.matgroup.api.repository.PaginaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaginaService {
    private final PaginaRepository paginaRepository;

    public List<Pagina> findAll() {
        return paginaRepository.findAll(Sort.by("rolId"));
    }

    public Optional<Pagina> findById(Long id) {
        return paginaRepository.findById(id);
    }

    public List<Pagina> findByRol(Long idRol) {
        return paginaRepository.findByRolIdOrderByNombre(idRol);
    }

    public Pagina save(Pagina pagina) {
        return paginaRepository.save(pagina);
    }

    public void deleteById(Long id) {
        paginaRepository.deleteById(id);
    }
}