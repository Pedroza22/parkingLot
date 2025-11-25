package com.pedroza.parking.api.service;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pedroza.parking.api.domain.ParkingLot;
import com.pedroza.parking.api.domain.ParkingSpot;
import com.pedroza.parking.api.domain.SpotType;
import com.pedroza.parking.api.dto.CreateParkingLotRequest;
import com.pedroza.parking.api.dto.UpdateParkingLotRequest;
import com.pedroza.parking.api.exception.NotFoundException;
import com.pedroza.parking.api.repository.ParkingLotRepository;
import com.pedroza.parking.api.repository.ParkingSpotRepository;

@Service
public class ParkingLotService {
  private final ParkingLotRepository lotRepo;
  private final ParkingSpotRepository spotRepo;

  public ParkingLotService(ParkingLotRepository lotRepo, ParkingSpotRepository spotRepo) {
    this.lotRepo = lotRepo;
    this.spotRepo = spotRepo;
  }

  @Transactional
  public ParkingLot create(CreateParkingLotRequest req) {
    ParkingLot lot = new ParkingLot();
    lot.setName(req.name);
    lot.setAddress(req.address);
    lot.setCity(req.city);
    lot.setHourlyRate(BigDecimal.valueOf(req.hourlyRate));
    lot.setOpeningTime(LocalTime.parse(req.openingTime));
    lot.setClosingTime(LocalTime.parse(req.closingTime));
    lot.setIsActive(Boolean.TRUE.equals(req.isActive));
    int total = (Optional.ofNullable(req.standardSpots).orElse(0))
      + (Optional.ofNullable(req.motorcycleSpots).orElse(0))
      + (Optional.ofNullable(req.handicappedSpots).orElse(0))
      + (Optional.ofNullable(req.electricSpots).orElse(0));
    lot.setTotalSpots(total);
    lot = lotRepo.save(lot);

    List<ParkingSpot> spots = new ArrayList<>();
    for (int i = 1; i <= Optional.ofNullable(req.standardSpots).orElse(0); i++) {
      ParkingSpot s = new ParkingSpot();
      s.setParkingLotId(lot.getId());
      s.setSpotNumber("A-" + String.format("%03d", i));
      s.setSpotType(SpotType.standard);
      spots.add(s);
    }
    for (int i = 1; i <= Optional.ofNullable(req.motorcycleSpots).orElse(0); i++) {
      ParkingSpot s = new ParkingSpot();
      s.setParkingLotId(lot.getId());
      s.setSpotNumber("M-" + String.format("%03d", i));
      s.setSpotType(SpotType.motorcycle);
      spots.add(s);
    }
    for (int i = 1; i <= Optional.ofNullable(req.handicappedSpots).orElse(0); i++) {
      ParkingSpot s = new ParkingSpot();
      s.setParkingLotId(lot.getId());
      s.setSpotNumber("H-" + String.format("%03d", i));
      s.setSpotType(SpotType.handicapped);
      spots.add(s);
    }
    for (int i = 1; i <= Optional.ofNullable(req.electricSpots).orElse(0); i++) {
      ParkingSpot s = new ParkingSpot();
      s.setParkingLotId(lot.getId());
      s.setSpotNumber("E-" + String.format("%03d", i));
      s.setSpotType(SpotType.electric);
      spots.add(s);
    }

    spotRepo.saveAll(spots);
    return lot;
  }

  @Transactional
  public ParkingLot update(String id, UpdateParkingLotRequest req) {
    ParkingLot lot = lotRepo.findById(id).orElseThrow(() -> new NotFoundException("parking_lot_not_found"));
    lot.setName(req.name);
    lot.setAddress(req.address);
    lot.setCity(req.city);
    lot.setHourlyRate(BigDecimal.valueOf(req.hourlyRate));
    lot.setOpeningTime(LocalTime.parse(req.openingTime));
    lot.setClosingTime(LocalTime.parse(req.closingTime));
    lot.setIsActive(Boolean.TRUE.equals(req.isActive));
    return lotRepo.save(lot);
  }

  public List<ParkingLot> findAll() { return lotRepo.findAll(); }
  public Optional<ParkingLot> findById(String id) { return lotRepo.findById(id); }
  @Transactional
  public void delete(String id) { lotRepo.deleteById(id); }
}
