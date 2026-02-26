package com.matgroup.api.converter;

import com.matgroup.api.model.Cliente;
import com.matgroup.api.model.Lote;
import com.matgroup.api.service.ClienteService;
import com.matgroup.api.service.LoteService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ClienteConverter implements Converter<String, Cliente> {

    private final ClienteService clienteService;

    public ClienteConverter(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Override
    public Cliente convert(String id) {
        try {
            return clienteService.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
