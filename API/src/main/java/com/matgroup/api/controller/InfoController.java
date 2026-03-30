package com.matgroup.api.controller;

import com.matgroup.api.model.Info;
import com.matgroup.api.service.InfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/info")
@RequiredArgsConstructor
@CrossOrigin
public class InfoController {

    private final InfoService infoService;

    @GetMapping("/pedido/{idPedido}")
    public ResponseEntity<List<Info>> getByPedido(@PathVariable Long idPedido) {
        List<Info> infoList = infoService.findByPedidoId(idPedido);

        if (infoList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }else {
            return ResponseEntity.ok(infoList);
        }
    }

    @PostMapping()
    public ResponseEntity<Info> create(@RequestBody Info info) {
        return ResponseEntity.status(HttpStatus.CREATED).body(infoService.save(info));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Info> update(@PathVariable Long id, @RequestBody Info info) {
        if(infoService.findById(id).isEmpty()){
            return ResponseEntity.notFound().build();
        }

        info.setId(id);
        return ResponseEntity.ok(infoService.save(info));
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Info> delete(@PathVariable Long id) {
        if(infoService.findById(id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        infoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
