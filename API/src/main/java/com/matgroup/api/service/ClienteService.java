package com.matgroup.api.service;

import com.matgroup.api.model.Cliente;
import com.matgroup.api.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public List<Cliente> findAll() {
        return clienteRepository.findAll(Sort.by("usuarioCif"));
    }

    public Optional<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }

    public List<Cliente> findByUsuario(String usuarioCif) {
        return clienteRepository.findByUsuarioCifOrderById(usuarioCif);
    }

    public List<Cliente> findDefault(String usuarioCif){
        return clienteRepository.findByUsuarioCifAndNombre(usuarioCif,"[Sin Asignar]");
    }

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public void deleteById(Long id) {
        clienteRepository.deleteById(id);
    }
}
