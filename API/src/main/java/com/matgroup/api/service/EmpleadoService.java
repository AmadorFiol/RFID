package com.matgroup.api.service;

import com.matgroup.api.model.Empleado;
import com.matgroup.api.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    public List<Empleado> findAll() {
        return empleadoRepository.findAll(Sort.by("usuarioCif"));
    }

    public Optional<Empleado> findByDni(String dni) {
        return empleadoRepository.findByDni(dni);
    }

    public List<Empleado> findByUsuario(String usuarioCif) {
        return empleadoRepository.findByUsuarioCifOrderByDni(usuarioCif);
    }

    public Optional<Empleado> findByEtiqueta(Long etiquetaId) {
        return empleadoRepository.findByEtiquetaIid(etiquetaId);
    }

    public Empleado save(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    public void deleteByDni(String dni) {
        empleadoRepository.deleteByDni(dni);
    }
}
