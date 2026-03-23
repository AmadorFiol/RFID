package com.matgroup.api.service;

import com.matgroup.api.model.Rol;
import com.matgroup.api.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RolService {
    private final RolRepository rolRepository;

    public List<Rol> findAll() { return rolRepository.findAll();
    }

    public Optional<Rol> findById(Long id) {return rolRepository.findById(id);
    }

    public Rol save(Rol rol) {return rolRepository.save(rol);
    }

    public void deleteById(Long id) {rolRepository.deleteById(id);
    }
}
