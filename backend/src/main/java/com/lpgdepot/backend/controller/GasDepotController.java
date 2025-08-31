package com.lpgdepot.backend.controller;

import com.lpgdepot.backend.entity.GasDepot;
import com.lpgdepot.backend.entity.GasTank;
import com.lpgdepot.backend.entity.GasType;
import com.lpgdepot.backend.exception.NotFoundException;
import com.lpgdepot.backend.service.GasDepotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/depot")
public class GasDepotController {
    private final GasDepotService gasDepotService;

    @Autowired
    public GasDepotController(GasDepotService gasDepotService) {
        this.gasDepotService = gasDepotService;
    }

//    @GetMapping("/text")
//    public ResponseEntity<String> text(){
//        String depots = "everything is good";
//
//        return new ResponseEntity<>(depots, HttpStatus.OK);
//    }

    @GetMapping("/list")
    public ResponseEntity<List<GasDepot>> getAllDepot(){
        try {
            List<GasDepot> depots = gasDepotService.getDepotList();

            if (depots.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(depots, HttpStatus.OK);

        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/gas_types")
    public ResponseEntity<List<GasType>> getGasTypes() {
        List<GasType> types = gasDepotService.getGastTypeList();
        return new ResponseEntity<>(types, HttpStatus.OK);
    }

    @GetMapping("/gas_tanks")
    public ResponseEntity<List<GasTank>> gatGasTanks() {
        List<GasTank> tanks = gasDepotService.getTanksList();
        return new ResponseEntity<>(tanks, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GasDepot> getGasDepotById(@PathVariable("id") int id){
        try {
            GasDepot depot = gasDepotService.getGasDepotById(id);
            System.out.println(depot.getGasType());

            return new ResponseEntity<>(depot, HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/currentState/{id}")
    public ResponseEntity<Long> getGasDepotStatusById(@PathVariable("id") int id){
        try {
            Long result = gasDepotService.getGasDepotCurrentStatus(id);

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/load")
    public ResponseEntity<String> loadGasDepot(@RequestParam(name = "id") int id, @RequestParam(name = "updateValue") Long updateValue){
        try {
            int res = gasDepotService.loadGasDepot(id, updateValue);

            if (res == 1) {
                return new ResponseEntity<>("Updated gas depot - " + id, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Not enough space on gas depot - " + id, HttpStatus.OK);
            }

        } catch (NotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/unload")
    public ResponseEntity<String> unloadGasDepot(@RequestParam(name = "id") int id, @RequestParam(name = "updateValue") Long updateValue){
        int res = gasDepotService.unloadGasDepot(id, updateValue);
        if (res == 1) {
            return new ResponseEntity<>("Unloaded gas depot successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Not enough liquid gas on depot", HttpStatus.OK);
        }
    }
}
