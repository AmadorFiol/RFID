package com.matgroup.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "empleado",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BIGSERIAL")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "cif", nullable = false)
    private Usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_etiqueta", referencedColumnName = "iid", nullable = false)
    private Etiqueta etiqueta;

    @Column(name="dni", length = 16)
    private String dni;

    @Column(name="nombre", length = 32)
    private String nombre;

    @Column(name="apellido", length = 32)
    private String apellido;
}
