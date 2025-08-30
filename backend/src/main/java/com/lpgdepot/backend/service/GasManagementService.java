package com.lpgdepot.backend.service;

import com.lpgdepot.backend.entity.GasManagement;
import com.lpgdepot.backend.exception.NotFoundException;
import com.lpgdepot.backend.repository.GasManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GasManagementService {

    private final GasManagementRepository gasManagementRepo;

    private final GasDepotService gasDepotService;

    @Autowired
    public GasManagementService(GasManagementRepository gasManagementRepo, GasDepotService gasDepotService) {
        this.gasManagementRepo = gasManagementRepo;
        this.gasDepotService = gasDepotService;
    }

    public List<GasManagement> getAllGasManagementDocs(){
        List<GasManagement> docs = gasManagementRepo.findAll();

        if (docs.isEmpty()) {
            throw new NotFoundException("No doc records in gas management system");
        }

        return docs;
    }

}
