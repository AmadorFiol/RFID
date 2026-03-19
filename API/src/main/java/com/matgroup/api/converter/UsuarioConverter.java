package com.matgroup.api.converter;

import com.matgroup.api.model.Usuario;
import com.matgroup.api.service.UsuarioService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class UsuarioConverter implements Converter<String, Usuario> {

    private final UsuarioService usuarioService;

    public UsuarioConverter(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Override
    public Usuario convert(String id) {
        try {
            return usuarioService.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
