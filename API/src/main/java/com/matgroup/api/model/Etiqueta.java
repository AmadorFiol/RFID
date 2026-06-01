package com.matgroup.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.util.Objects;


@NoArgsConstructor
@AllArgsConstructor
class EtiquetaId implements Serializable {
    private String epc;
    private String tid;

    @Override
    public boolean equals(Object o) {
        return this.getClass().equals(o.getClass());
    }

    @Override
    public int hashCode() {
        return Objects.hash(epc, tid);
    }
}

@IdClass(EtiquetaId.class)
@Entity
@Table(name = "etiqueta",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Etiqueta {

    @ManyToOne
    @JoinColumn(name = "id_inventario", nullable = false)
    private Inventario inventario;

    @Column(name = "alias", length = 16)
    private String alias;

    @Id
    @Column(name = "epc", length = 64, nullable = false)
    private String epc;

    @Id
    @Column(name="tid", length = 32)
    private String tid;

    @Column(name="tagModel", length = 16)
    private String tagModel;

    @Column(name="alertar", columnDefinition = "BOOLEAN NOT NULL DEFAULT FALSE")
    private boolean alertar;

    //Id interno para poder hacer las FK y otras operaciones
    @Column(name="iid", columnDefinition = "BIGSERIAL", unique = true)
    private Long iid;

    // Constructor sin iid
    public Etiqueta(Inventario inventario, String alias, String epc, String tid, String tagModel, boolean alertar) {
        this.inventario = inventario;
        this.alias = alias;
        this.epc = epc;
        this.tid = tid;
        this.tagModel = tagModel;
        this.alertar = alertar;
    }
}
