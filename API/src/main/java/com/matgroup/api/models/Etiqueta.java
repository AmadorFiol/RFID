package com.matgroup.api.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="etiqueta")
public class Etiqueta {
    @Id
    private Integer id;

    @OneToMany
    private Integer[] idCliente;

    @OneToMany
    private Integer[] idLote;
}
