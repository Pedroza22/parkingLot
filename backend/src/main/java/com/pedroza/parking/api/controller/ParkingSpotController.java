package com.pedroza.parking.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pedroza.parking.api.domain.ParkingSpot;
import com.pedroza.parking.api.repository.ParkingSpotRepository;

@RestController
@RequestMapping("/api/parking-spots")
public class ParkingSpotController {
  private final ParkingSpotRepository spotRepo;
  public ParkingSpotController(ParkingSpotRepository spotRepo) { this.spotRepo = spotRepo; }

  @GetMapping
  public List<ParkingSpot> list(@RequestParam String parkingLotId, @RequestParam(required = false, defaultValue = "true") boolean availableOnly) {
    if (availableOnly) return spotRepo.findByParkingLotIdAndIsAvailableTrue(parkingLotId);
    return spotRepo.findByParkingLotId(parkingLotId);
  }
}
