package com.matgroup.api.service;

import com.matgroup.api.model.Etiqueta;
import com.matgroup.api.model.Pagina;
import com.matgroup.api.repository.PaginaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaginaService {
    private final PaginaRepository paginaRepository;

    public List<Pagina> findAll() { return paginaRepository.findAll();
    }

    public Optional<Pagina> findById(Long id) {return paginaRepository.findById(id);
    }

    public Pagina save(Pagina pagina) {return paginaRepository.save(pagina);
    }

    public void deleteById(Long id) {paginaRepository.deleteById(id);
    }

    public List<Pagina> findByUsuario(String idUsuario) {
        return paginaRepository.findByUsuarioId(idUsuario);
    }
}
