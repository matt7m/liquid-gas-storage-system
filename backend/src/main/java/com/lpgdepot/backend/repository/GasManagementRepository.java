package com.lpgdepot.backend.repository;

import com.lpgdepot.backend.entity.GasManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GasManagementRepository extends JpaRepository<GasManagement, Long> {
    //custom query methods can be added here if needed
    GasManagement findByDocumentNumber(@Param(value = "documentNumber") String code);
}
