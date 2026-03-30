package com.matgroup.api.converter;

import com.matgroup.api.model.Pedido;
import com.matgroup.api.service.PedidoService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class PedidoConverter implements Converter<String, Pedido> {

    private final PedidoService pedidoService;

    public PedidoConverter(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @Override
    public Pedido convert(String id) {
        try {
            return pedidoService.findById(Long.parseLong(id)).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
