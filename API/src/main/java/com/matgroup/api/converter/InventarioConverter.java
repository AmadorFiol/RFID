package com.matgroup.api.converter;

import com.matgroup.api.model.Inventario;
import com.matgroup.api.service.InventarioService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class InventarioConverter implements Converter<String, Inventario> {

    private final InventarioService inventarioService;

    public InventarioConverter(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @Override
    public Inventario convert(String id) {
        try {
            return inventarioService.findById(Long.parseLong(id)).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}