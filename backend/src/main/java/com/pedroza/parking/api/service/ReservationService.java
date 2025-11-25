package com.pedroza.parking.api.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pedroza.parking.api.domain.ParkingSpot;
import com.pedroza.parking.api.domain.Reservation;
import com.pedroza.parking.api.domain.ReservationStatus;
import com.pedroza.parking.api.dto.CreateReservationRequest;
import com.pedroza.parking.api.exception.ConflictException;
import com.pedroza.parking.api.exception.NotFoundException;
import com.pedroza.parking.api.repository.ParkingSpotRepository;
import com.pedroza.parking.api.repository.ReservationRepository;

@Service
public class ReservationService {
  private final ReservationRepository reservationRepo;
  private final ParkingSpotRepository spotRepo;

  public ReservationService(ReservationRepository reservationRepo, ParkingSpotRepository spotRepo) {
    this.reservationRepo = reservationRepo;
    this.spotRepo = spotRepo;
  }

  @Transactional
  public Reservation create(CreateReservationRequest req, java.math.BigDecimal hourlyRate) {
    ParkingSpot spot = spotRepo.findById(req.parkingSpotId).orElseThrow(() -> new NotFoundException("spot_not_found"));
    if (Boolean.FALSE.equals(spot.getIsAvailable())) throw new ConflictException("spot_not_available");
    OffsetDateTime start = OffsetDateTime.parse(req.startTime);
    OffsetDateTime end = OffsetDateTime.parse(req.endTime);
    if (!end.isAfter(start)) throw new ConflictException("invalid_time_range");
    long hours = Math.max(1, java.time.Duration.between(start, end).toHours());
    BigDecimal total = hourlyRate.multiply(BigDecimal.valueOf(hours));
    Reservation r = new Reservation();
    r.setUserId(req.userId);
    r.setParkingSpotId(spot.getId());
    r.setVehiclePlate(req.vehiclePlate.toUpperCase());
    r.setStartTime(start);
    r.setEndTime(end);
    r.setStatus(ReservationStatus.pending);
    r.setTotalAmount(total);
    Reservation saved = reservationRepo.save(r);
    spot.setIsAvailable(false);
    spotRepo.save(spot);
    return saved;
  }

  @Transactional
  public Reservation cancel(String reservationId) {
    Reservation r = reservationRepo.findById(reservationId).orElseThrow(() -> new NotFoundException("reservation_not_found"));
    r.setStatus(ReservationStatus.cancelled);
    reservationRepo.save(r);
    ParkingSpot spot = spotRepo.findById(r.getParkingSpotId()).orElseThrow(() -> new NotFoundException("spot_not_found"));
    spot.setIsAvailable(true);
    spotRepo.save(spot);
    return r;
  }
}
