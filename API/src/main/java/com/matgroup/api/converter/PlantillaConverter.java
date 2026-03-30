package com.matgroup.api.converter;

import com.matgroup.api.model.Plantilla;
import com.matgroup.api.service.PlantillaService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class PlantillaConverter implements Converter<String, Plantilla> {

    private final PlantillaService plantillaService;

    public PlantillaConverter(PlantillaService plantillaService) {
        this.plantillaService = plantillaService;
    }

    @Override
    public Plantilla convert(String id) {
        try {
            return plantillaService.findById(Long.parseLong(id)).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
