package com.lpgdepot.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "gas_types")
public class GasType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "type")
    private String type;

    @Column(name = "density")
    private Double density;

    @Override
    public String toString() {
        return "GasTank{" +
                "id=" + id +
                ", gas name='" + type + '\'' +
                ", specs=" + density +
                '}';
    }
}

