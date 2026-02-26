package com.matgroup.api.converter;

import com.matgroup.api.model.Lote;
import com.matgroup.api.service.LoteService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LoteConverter implements Converter<String, Lote> {

    private final LoteService loteService;

    public LoteConverter(LoteService loteService) {
        this.loteService = loteService;
    }

    @Override
    public Lote convert(String id) {
        try {
            return loteService.findById(Long.parseLong(id)).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
