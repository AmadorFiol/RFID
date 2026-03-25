package com.matgroup.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "pedido",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "id_plantilla")
    private Plantilla plantilla;

    @Column(name = "cantitad")
    private Integer cantidad;

    @Column(name = "info")
    private String info;
}