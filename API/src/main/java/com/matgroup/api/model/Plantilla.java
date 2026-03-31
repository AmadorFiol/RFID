package com.matgroup.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Blob;

@Entity
@Table(name = "plantilla",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plantilla {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "cif")
    private Usuario usuario;

    @Column(name = "nombre", length = 64)
    private String nombre;

    @Column(name = "zpl_code",columnDefinition = "TEXT")
    private String zplCode;
}