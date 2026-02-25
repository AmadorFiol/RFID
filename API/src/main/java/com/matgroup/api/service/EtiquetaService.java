package com.matgroup.api.service;

import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.repository.EtiquetaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EtiquetaService {

    private final EtiquetaRepository etiquetaRepository;

    public List<Etiqueta> findAll() {
        return etiquetaRepository.findAll();
    }

    public Optional<Etiqueta> findById(Long id) {
        return etiquetaRepository.findById(id);
    }

    public List<Etiqueta> findByCliente(String cif) {
        return etiquetaRepository.findByClienteCif(cif);
    }

    public List<Etiqueta> findByLote(Long idLote) {
        return etiquetaRepository.findByLoteId(idLote);
    }

    public Etiqueta save(Etiqueta etiqueta) {
        return etiquetaRepository.save(etiqueta);
    }

    public void deleteById(Long id) {
        etiquetaRepository.deleteById(id);
    }
}
