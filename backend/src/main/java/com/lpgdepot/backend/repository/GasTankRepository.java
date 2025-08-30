package com.lpgdepot.backend.repository;

import com.lpgdepot.backend.entity.GasTank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GasTankRepository extends JpaRepository<GasTank, Long> {
    //custom query methods can be added here if needed
}