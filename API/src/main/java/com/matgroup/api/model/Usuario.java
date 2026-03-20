

package com.matgroup.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "usuario",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @Column(name = "cif", length = 8, nullable = false)
    private String cif;

    @Column(name = "nombre", length = 64)
    private String nombre;

    @Column(name = "email", length = 64)
    private String email;

    @Column(name = "password", length = 16)
    private String password;
}
