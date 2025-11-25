package com.pedroza.parking.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedroza.parking.api.dto.ActiveRecordResponse;
import com.pedroza.parking.api.dto.CheckoutRequest;
import com.pedroza.parking.api.dto.VehicleEntryRequest;
import com.pedroza.parking.api.service.ParkingLotService;
import com.pedroza.parking.api.service.ParkingRecordService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/parking-records")
@Tag(name = "Parking Records")
public class ParkingRecordController {
  private final ParkingRecordService recordService;
  private final ParkingLotService lotService;

  public ParkingRecordController(ParkingRecordService recordService, ParkingLotService lotService) {
    this.recordService = recordService;
    this.lotService = lotService;
  }

  @PostMapping
  public ResponseEntity<?> create(@Validated @RequestBody VehicleEntryRequest req) {
    return ResponseEntity.ok(recordService.createEntry(req));
  }

  @PatchMapping("/{id}/checkout")
  public ResponseEntity<?> checkout(@PathVariable String id, @Validated @RequestBody CheckoutRequest req) {
    return ResponseEntity.ok(recordService.checkout(id, req));
  }

  @GetMapping("/active")
  public java.util.List<ActiveRecordResponse> active() {
    return recordService.listActive();
  }
}
