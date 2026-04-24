package com.matgroup.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lectores",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lectores {
    @Id
    @Column(columnDefinition = "BIGSERIAL")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "cif", nullable = false)
    private Usuario usuario;

    @Column(name="marca", length = 16, nullable = false)
    private String marca;

    @Column(name = "hostname", length = 16, nullable = false)
    private String hostname;
}
