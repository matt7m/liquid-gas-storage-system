package com.lpgdepot.backend.repository;

import com.lpgdepot.backend.entity.GasType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GasTypeRepository extends JpaRepository<GasType, Long> {
    //custom query methods can be added here if needed
}
