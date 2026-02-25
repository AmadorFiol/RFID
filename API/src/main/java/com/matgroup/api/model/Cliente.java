package com.matgroup.api.model;

import com.matgroup.api.service.ClienteService;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "cliente",schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @Column(name = "cif", length = 8, nullable = false)
    private String cif;

    @Column(name = "nombre", length = 64)
    private String nombre;
}
