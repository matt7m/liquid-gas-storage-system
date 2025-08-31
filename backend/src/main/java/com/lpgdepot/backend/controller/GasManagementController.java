package com.lpgdepot.backend.controller;

import com.lpgdepot.backend.entity.GasManagement;
import com.lpgdepot.backend.exception.NotFoundException;
import com.lpgdepot.backend.service.GasDepotService;
import com.lpgdepot.backend.service.GasManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/docs/list")
    public ResponseEntity<List<GasManagement>> getAllDocuments() {
        List<GasManagement> docs = gasManagementService.getAllGasManagementDocs();
        if (docs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(docs, HttpStatus.OK);
    }

    @GetMapping("/doc")
    public ResponseEntity<GasManagement> getDocumentByArc(@RequestParam("arc") String arc) {
        try {
            GasManagement doc = gasManagementService.getManagementDocByARC(arc);

            return new ResponseEntity<>(doc, HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/new_doc")
    public ResponseEntity<String> createGasManagement(@Valid @RequestBody GasManagement gasManagement) {
        try {
            gasManagementService.addGasManagementDoc(gasManagement);

            return new ResponseEntity<>("New management doc added.", HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/doc_del")
    public ResponseEntity<String> deleteGasManagement(@RequestParam("arc") String arc) {
        try {
            gasManagementService.deleteManagementDoc(arc);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>("Document deleted from system successfully.", HttpStatus.OK);
    }

}
