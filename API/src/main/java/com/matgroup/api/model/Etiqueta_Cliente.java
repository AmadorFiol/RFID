package com.matgroup.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "etiqueta_cliente",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Etiqueta_Cliente {
    @Id
    @OneToOne
    @JoinColumn(name = "id_etiqueta", referencedColumnName = "iid", nullable = false)
    private Etiqueta etiqueta;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;
}
