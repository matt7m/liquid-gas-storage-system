package com.lpgdepot.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gas_tanks")
public class GasTank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "capacity")
    private Long capacity;

    @Override
    public String toString() {
        return "GasTank{" +
                "id=" + id +
                ", licenseNumber='" + licenseNumber + '\'' +
                ", capacity=" + capacity +
                '}';
    }
}

