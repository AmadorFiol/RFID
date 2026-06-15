package com.matgroup.api.converter;

import com.matgroup.api.model.Empleado;
import com.matgroup.api.service.EmpleadoService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class EmpleadoConverter implements Converter<String, Empleado> {

    private final EmpleadoService empleadoService;

    public EmpleadoConverter(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @Override
    public Empleado convert(String dni) {
        try {
            return empleadoService.findByDni(dni).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
