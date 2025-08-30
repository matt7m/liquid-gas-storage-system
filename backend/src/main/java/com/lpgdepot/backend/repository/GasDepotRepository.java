package com.lpgdepot.backend.repository;

import com.lpgdepot.backend.entity.GasDepot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GasDepotRepository extends JpaRepository<GasDepot, Long> {
    //custom query methods can be added here if needed
}
