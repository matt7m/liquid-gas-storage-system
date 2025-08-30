package com.lpgdepot.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name= "gas_depots")
public class GasDepot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "capacity")
    private Long capacity;

    @Column(name = "current_status")
    private Long currentStatus;

    //foreign key to gas_type
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "gas_type_id", referencedColumnName = "id")
    private GasType gasType;
}
