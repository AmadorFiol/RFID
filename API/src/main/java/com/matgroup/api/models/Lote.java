package com.matgroup.api.models;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;

@Data
@Entity
@Table(name="lote")
public class Lote {
    @Id
    private Integer id;

    private Date fechaImpresion;
}
