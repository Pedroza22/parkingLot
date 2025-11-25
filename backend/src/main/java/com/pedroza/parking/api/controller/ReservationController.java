package com.pedroza.parking.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pedroza.parking.api.domain.ParkingLot;
import com.pedroza.parking.api.dto.CreateReservationRequest;
import com.pedroza.parking.api.exception.NotFoundException;
import com.pedroza.parking.api.service.ParkingLotService;
import com.pedroza.parking.api.service.ReservationService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservations")
public class ReservationController {
  private final ReservationService reservationService;
  private final ParkingLotService lotService;

  public ReservationController(ReservationService reservationService, ParkingLotService lotService) {
    this.reservationService = reservationService;
    this.lotService = lotService;
  }

  @PostMapping
  public ResponseEntity<?> create(@Validated @RequestBody CreateReservationRequest req, @RequestParam String parkingLotId) {
    ParkingLot lot = lotService.findById(parkingLotId).orElseThrow(() -> new NotFoundException("parking_lot_not_found"));
    return ResponseEntity.ok(reservationService.create(req, lot.getHourlyRate()));
  }

  @PatchMapping("/{id}/cancel")
  public ResponseEntity<?> cancel(@PathVariable String id) {
    return ResponseEntity.ok(reservationService.cancel(id));
  }
}
