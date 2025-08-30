package com.lpgdepot.backend.controller;

import com.lpgdepot.backend.entity.GasDepot;
import com.lpgdepot.backend.entity.GasTank;
import com.lpgdepot.backend.entity.GasType;
import com.lpgdepot.backend.service.GasDepotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/depot")
public class GasDepotController {
    private final GasDepotService gasDepotService;

    @Autowired
    public GasDepotController(GasDepotService gasDepotService) {
        this.gasDepotService = gasDepotService;
    }

    @GetMapping("/text")
    public ResponseEntity<String> text(){
        String depots = "everything is good";

        return new ResponseEntity<>(depots, HttpStatus.OK);
    }

    @GetMapping("/status")
    public ResponseEntity<List<GasDepot>> getAllDepot(){
//        try {
            List<GasDepot> depots = gasDepotService.getDepotStatus();

            if (depots.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            //System.out.println(depots.get(1).getName());
            //System.out.println(depots.get(1).getCapacity());
            return new ResponseEntity<>(depots, HttpStatus.OK);

//        } catch (Exception e){
//            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @GetMapping("/gas_tanks")
    public ResponseEntity<List<GasTank>> gatGasTanks() {
        List<GasTank> tanks = gasDepotService.getTanksList();
        return new ResponseEntity<>(tanks, HttpStatus.OK);
    }
}
