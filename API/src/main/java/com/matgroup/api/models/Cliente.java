package com.matgroup.api.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="cliente")
public class Cliente {
    @Id
    private Integer id;

    private String nombre;
}
