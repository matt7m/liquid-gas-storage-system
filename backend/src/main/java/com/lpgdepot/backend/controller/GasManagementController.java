package com.lpgdepot.backend.controller;

import com.lpgdepot.backend.entity.GasManagement;
import com.lpgdepot.backend.service.GasDepotService;
import com.lpgdepot.backend.service.GasManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/managements")
public class GasManagementController {

    private final GasManagementService gasManagementService;

    private final GasDepotService gasDepotService;

    public GasManagementController(GasManagementService gasManagementService, GasDepotService gasDepotService) {
        this.gasManagementService = gasManagementService;
        this.gasDepotService = gasDepotService;
    }

    @GetMapping("/docs")
    public ResponseEntity<List<GasManagement>> getAllDocuments() {
        List<GasManagement> docs = gasManagementService.getAllGasManagementDocs();
        if (docs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(docs, HttpStatus.OK);
    }
}
