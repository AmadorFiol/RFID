package com.matgroup.api.converter;

import com.matgroup.api.model.Rol;
import com.matgroup.api.service.RolService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class RolConverter implements Converter<String, Rol> {
    private final RolService rolService;

    public RolConverter(RolService rolService) {
        this.rolService = rolService;
    }

    @Override
    public Rol convert(String id) {
        try {
            return rolService.findById(Long.parseLong(id)).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}


