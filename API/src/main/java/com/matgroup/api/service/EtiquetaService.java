package com.matgroup.api.service;

import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.repository.EtiquetaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EtiquetaService {

    private final EtiquetaRepository etiquetaRepository;

    public List<Etiqueta> findAll() {
        return etiquetaRepository.findAll(Sort.by("id"));
    }

    public Optional<Etiqueta> findById(Long id) {
        return etiquetaRepository.findById(id);
    }

    public List<Etiqueta> findByUsuario(String idUsuario) {
        return etiquetaRepository.findByUsuarioIdOrderById(idUsuario);
    }

    public Etiqueta findByEpcAndTid(String epc, String tid) {
        return etiquetaRepository.findByEpcAndTid(epc, tid);
    }

    public Etiqueta save(Etiqueta etiqueta) {
        return etiquetaRepository.save(etiqueta);
    }

    public void deleteById(Long id) {
        etiquetaRepository.deleteById(id);
    }
}
