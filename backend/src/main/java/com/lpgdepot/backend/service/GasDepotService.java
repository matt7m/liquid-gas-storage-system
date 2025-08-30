package com.lpgdepot.backend.service;

import com.lpgdepot.backend.entity.GasDepot;
import com.lpgdepot.backend.entity.GasTank;
import com.lpgdepot.backend.exception.NotFoundException;
import com.lpgdepot.backend.repository.GasDepotRepository;
import com.lpgdepot.backend.repository.GasTankRepository;
import com.lpgdepot.backend.repository.GasTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GasDepotService {

    private final GasTankRepository gasTankRepository;

    private final GasTypeRepository gasTypeRepository;

    private final GasDepotRepository gasDepotRepository;

    @Autowired
    public GasDepotService(GasTankRepository gasTankRepo, GasTypeRepository gasTypeRepo, GasDepotRepository gasDepotRepo) {
        this.gasTankRepository = gasTankRepo;
        this.gasTypeRepository = gasTypeRepo;
        this.gasDepotRepository = gasDepotRepo;
    }

    public List<GasDepot> getDepotStatus(){
        List<GasDepot> depots = gasDepotRepository.findAll();

        if (depots.isEmpty()){
            throw new NotFoundException("No gas tanks found in db!");
        }
        System.out.println("info z depotrsa service: "  + depots.get(5).getName());
        return depots;
    }

    public List<GasTank> getTanksList() {
        List<GasTank> tanks = gasTankRepository.findAll();

        if (tanks.isEmpty()){
            throw new NotFoundException("No gas tanks found in db!");
        }

        return tanks;
    }

}
