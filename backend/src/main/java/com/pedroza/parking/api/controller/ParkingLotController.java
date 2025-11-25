package com.pedroza.parking.api.controller;

import com.pedroza.parking.api.domain.ParkingLot;
import com.pedroza.parking.api.domain.ParkingSpot;
import com.pedroza.parking.api.dto.CreateParkingLotRequest;
import com.pedroza.parking.api.dto.UpdateParkingLotRequest;
import com.pedroza.parking.api.dto.ParkingLotResponse;
import com.pedroza.parking.api.exception.NotFoundException;
import com.pedroza.parking.api.repository.ParkingSpotRepository;
import com.pedroza.parking.api.service.ParkingLotService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/parking-lots")
@Tag(name = "Parking Lots")
public class ParkingLotController {
  private final ParkingLotService lotService;
  private final ParkingSpotRepository spotRepo;

  public ParkingLotController(ParkingLotService lotService, ParkingSpotRepository spotRepo) {
    this.lotService = lotService;
    this.spotRepo = spotRepo;
  }

  @GetMapping
  public List<ParkingLotResponse> list() {
    return lotService.findAll().stream().map(this::toResponse).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public ParkingLotResponse get(@PathVariable String id) {
    ParkingLot lot = lotService.findById(id).orElseThrow(() -> new NotFoundException("parking_lot_not_found"));
    return toResponse(lot);
  }

  @PostMapping
  public ResponseEntity<ParkingLotResponse> create(@Validated @RequestBody CreateParkingLotRequest req) {
    ParkingLot lot = lotService.create(req);
    return ResponseEntity.ok(toResponse(lot));
  }

  @PutMapping("/{id}")
  public ParkingLotResponse update(@PathVariable String id, @Validated @RequestBody UpdateParkingLotRequest req) {
    ParkingLot lot = lotService.update(id, req);
    return toResponse(lot);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable String id) { lotService.delete(id); }

  private ParkingLotResponse toResponse(ParkingLot lot) {
    List<ParkingSpot> spots = spotRepo.findByParkingLotId(lot.getId());
    int available = (int) spots.stream().filter(s -> Boolean.TRUE.equals(s.getIsAvailable())).count();
    Map<String, Integer> spotTypes = new HashMap<>();
    spotTypes.put("standard", (int) spots.stream().filter(s -> s.getSpotType().name().equals("standard")).count());
    spotTypes.put("handicapped", (int) spots.stream().filter(s -> s.getSpotType().name().equals("handicapped")).count());
    spotTypes.put("motorcycle", (int) spots.stream().filter(s -> s.getSpotType().name().equals("motorcycle")).count());
    spotTypes.put("electric", (int) spots.stream().filter(s -> s.getSpotType().name().equals("electric")).count());
    ParkingLotResponse resp = new ParkingLotResponse();
    resp.id = lot.getId();
    resp.name = lot.getName();
    resp.address = lot.getAddress();
    resp.city = lot.getCity();
    resp.hourlyRate = lot.getHourlyRate();
    resp.openingTime = lot.getOpeningTime();
    resp.closingTime = lot.getClosingTime();
    resp.isActive = lot.getIsActive();
    resp.availableSpots = available;
    resp.totalSpots = spots.size();
    resp.spotTypes = spotTypes;
    return resp;
  }
}
