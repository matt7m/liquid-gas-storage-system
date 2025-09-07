package com.lpgdepot.backend.service;

import com.lpgdepot.backend.entity.GasDepot;
import com.lpgdepot.backend.entity.GasTank;
import com.lpgdepot.backend.entity.GasType;
import com.lpgdepot.backend.exception.NotFoundException;
import com.lpgdepot.backend.repository.GasDepotRepository;
import com.lpgdepot.backend.repository.GasTankRepository;
import com.lpgdepot.backend.repository.GasTypeRepository;
import com.lpgdepot.backend.util.DepotUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

    public List<GasDepot> getDepotList(){
        List<GasDepot> depots = gasDepotRepository.findAll();

        if (depots.isEmpty()){
            throw new NotFoundException("No gas tanks found in db!");
        }

        return depots;
    }

    public GasDepot getGasDepotById(long id){
        Optional<GasDepot> optionalDepot = gasDepotRepository.findById(id);

        if (optionalDepot.isPresent()){
            return optionalDepot.get();
        } else {
            throw new NotFoundException("No gas tank found in db!");
        }
    }

    public Long getGasDepotCurrentStatus(long id){
        Optional<GasDepot> optionalDepot = gasDepotRepository.findById(id);

        if (optionalDepot.isPresent()){
            return optionalDepot.get().getCurrentStatus();
        } else {
            throw new NotFoundException("No gas tank found in db!");
        }
    }

    public List<GasTank> getTanksList() {
        List<GasTank> tanks = gasTankRepository.findAll();

        if (tanks.isEmpty()){
            throw new NotFoundException("No gas tanks found in db!");
        }

        return tanks;
    }

    public List<GasType> getGastTypeList() {
        List<GasType> types = gasTypeRepository.findAll();

        if (types.isEmpty()) {
            throw new NotFoundException("No gas type founded in db!");
        }

        return types;
    }

    @Transactional
    public int loadGasDepot(long id, Long updateValue) {
        Optional<GasDepot> optionalDepot = gasDepotRepository.findById(id);

        if (optionalDepot.isPresent()){
            GasDepot gasDepot = optionalDepot.get();
            Long currentState = gasDepot.getCurrentStatus();
            Long capacity = gasDepot.getCapacity();

            if (DepotUtil.checkLoadOperation(capacity, currentState, updateValue)){
                gasDepot.setCurrentStatus(currentState + updateValue);
                gasDepotRepository.save(gasDepot);

                return 1;
            } else {
                //System.out.println("cant be loaded");
                return 2;
            }

        } else {
            throw new NotFoundException("No gas tank found in db!");
        }
    }

    @Transactional
    public int unloadGasDepot(long id, Long updateValue) {
        Optional<GasDepot> optionalDepot = gasDepotRepository.findById(id);

        if (optionalDepot.isPresent()) {
            GasDepot gasDepot = optionalDepot.get();
            Long currentState = gasDepot.getCurrentStatus();

            if (DepotUtil.checkUnloadOperation(currentState, updateValue)) {
                gasDepot.setCurrentStatus(currentState - updateValue);
                gasDepotRepository.save(gasDepot);
                //System.out.println("unloaded successfully");
                return 1;
            } else {
                //System.out.println("cant be unloaded liquid gas");
                return 2;
            }

        } else {
            throw new NotFoundException("No gas tank found in db!");
        }
    }

}
