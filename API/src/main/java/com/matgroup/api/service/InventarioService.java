package com.matgroup.api.service;

import com.matgroup.api.model.Inventario;
import com.matgroup.api.repository.InventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventarioService {

    private final InventarioRepository inventarioRepository;

    public List<Inventario> findAll() {
        return inventarioRepository.findAll();
    }

    public Optional<Inventario> findById(Long id) {
        return inventarioRepository.findById(id);
    }

    public Inventario save(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    public void deleteById(Long id) {
        inventarioRepository.deleteById(id);
    }
}
