package com.matgroup.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "fichaje",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fichaje {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BIGSERIAL")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_empleado", referencedColumnName = "dni", nullable = false)
    private Empleado empleado;

    @Column(name = "entrada")
    private Boolean entrada;

    @Column(name = "timestamp", columnDefinition = "TIMESTAMP")
    private Timestamp timestamp;

    public Fichaje(Empleado empleado, Boolean entrada) {
        this.empleado = empleado;
        this.entrada = entrada;
        this.timestamp = new Timestamp(System.currentTimeMillis());
    }
}
