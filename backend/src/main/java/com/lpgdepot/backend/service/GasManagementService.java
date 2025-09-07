package com.lpgdepot.backend.service;

import com.lpgdepot.backend.entity.GasDepot;
import com.lpgdepot.backend.entity.GasManagement;
import com.lpgdepot.backend.exception.InvalidGasStateException;
import com.lpgdepot.backend.exception.NotFoundException;
import com.lpgdepot.backend.repository.GasManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class GasManagementService {

    private final GasManagementRepository gasManagementRepository;

    private final GasDepotService gasDepotService;

    @Autowired
    public GasManagementService(GasManagementRepository gasManagementRepo, GasDepotService gasDepotService) {
        this.gasManagementRepository = gasManagementRepo;
        this.gasDepotService = gasDepotService;
    }

    public List<GasManagement> getAllGasManagementDocs(){
        List<GasManagement> docs = gasManagementRepository.findAll();

        if (docs.isEmpty()) {
            throw new NotFoundException("No doc records in gas management system");
        }

        return docs;
    }

    public GasManagement getManagementDocByARC(String arc){
        GasManagement gasManagement = gasManagementRepository.findByDocumentNumber(arc);

        if (Objects.isNull(gasManagement)){
            throw new NotFoundException("No document with arc code " + arc + " in gas management system");
        }

        return gasManagement;
    }

    @Transactional
    public void addGasManagementDoc(GasManagement gasManagement){
        //GasTank tank = gasManagement.getGasTank();
        GasDepot depot = gasManagement.getGasDepot();

        if (gasManagement.getOperation().contains("import")){
            int res = gasDepotService.loadGasDepot(depot.getId(), gasManagement.getGasAmount());
            if (res == 2)
                throw new InvalidGasStateException("Cant load this depot");
        } else {
            int res = gasDepotService.unloadGasDepot(depot.getId(), gasManagement.getGasAmount());
            if (res == 2)
                throw new InvalidGasStateException("Cant unload this depot");
        }

        //return null;
        gasManagementRepository.save(gasManagement);
    }

    @Transactional
    public void deleteManagementDoc(String arc){
        GasManagement gasManagement = getManagementDocByARC(arc);

        Long idOfDelete = Long.valueOf(gasManagement.getId());
        try {
            gasManagementRepository.deleteById(idOfDelete);

        } catch (NotFoundException e) {
            throw new NotFoundException("Not founded document to delete");
        }
    }
}
