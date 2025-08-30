package com.lpgdepot.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gas_managements")
public class GasManagement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "arc_code")
    private String documentNumber;

    @Column(name = "date")
    private Date date;

    @Column(name = "operation")
    private String operation;

    @ManyToOne
    @JoinColumn(name = "tank_id", referencedColumnName = "id")
    private GasTank gasTank;

    @ManyToOne
    @JoinColumn(name = "depot_id", referencedColumnName = "id")
    private GasDepot gasDepot;

    @Column(name = "amount")
    private Long gasAmount;

    @Column(name = "op_description")
    private String description;

    @Override
    public String toString() {
        return "GasManagement{" +
                "id=" + id +
                ", documentNumber='" + documentNumber + '\'' +
                ", date=" + date +
                ", operation='" + operation + '\'' +
                ", gasTank=" + gasTank +
                ", gasDepot=" + gasDepot +
                ", gasAmount=" + gasAmount +
                ", description='" + description + '\'' +
                '}';
    }
}
