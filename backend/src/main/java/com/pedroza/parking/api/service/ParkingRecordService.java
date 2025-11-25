package com.pedroza.parking.api.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pedroza.parking.api.domain.ParkingRecord;
import com.pedroza.parking.api.domain.ParkingSpot;
import com.pedroza.parking.api.domain.Payment;
import com.pedroza.parking.api.domain.PaymentMethod;
import com.pedroza.parking.api.domain.PaymentStatus;
import com.pedroza.parking.api.dto.ActiveRecordResponse;
import com.pedroza.parking.api.dto.CheckoutRequest;
import com.pedroza.parking.api.dto.VehicleEntryRequest;
import com.pedroza.parking.api.exception.NotFoundException;
import com.pedroza.parking.api.repository.ParkingLotRepository;
import com.pedroza.parking.api.repository.ParkingRecordRepository;
import com.pedroza.parking.api.repository.ParkingSpotRepository;
import com.pedroza.parking.api.repository.PaymentRepository;

@Service
public class ParkingRecordService {
  private final ParkingRecordRepository recordRepo;
  private final ParkingSpotRepository spotRepo;
  private final PaymentRepository paymentRepo;
  private final ParkingLotRepository lotRepo;

  public ParkingRecordService(ParkingRecordRepository recordRepo, ParkingSpotRepository spotRepo, PaymentRepository paymentRepo, ParkingLotRepository lotRepo) {
    this.recordRepo = recordRepo;
    this.spotRepo = spotRepo;
    this.paymentRepo = paymentRepo;
    this.lotRepo = lotRepo;
  }

  @Transactional
  public ParkingRecord createEntry(VehicleEntryRequest req) {
    ParkingSpot spot = spotRepo.findById(req.parkingSpotId).orElseThrow(() -> new NotFoundException("spot_not_found"));
    if (Boolean.FALSE.equals(spot.getIsAvailable())) throw new NotFoundException("spot_not_available");
    ParkingRecord record = new ParkingRecord();
    record.setParkingSpotId(spot.getId());
    record.setVehiclePlate(req.vehiclePlate.toUpperCase());
    record.setEntryTime(OffsetDateTime.now());
    record.setRegisteredBy(req.registeredBy);
    ParkingRecord saved = recordRepo.save(record);
    spot.setIsAvailable(false);
    spotRepo.save(spot);
    return saved;
  }

  @Transactional
  public ParkingRecord checkout(String recordId, CheckoutRequest req) {
    ParkingRecord record = recordRepo.findById(recordId).orElseThrow(() -> new NotFoundException("record_not_found"));
    if (record.getExitTime() != null) return record;
    OffsetDateTime now = OffsetDateTime.now();
    long hours = Math.max(1, java.time.Duration.between(record.getEntryTime(), now).toHours());
    ParkingSpot spot = spotRepo.findById(record.getParkingSpotId()).orElseThrow(() -> new NotFoundException("spot_not_found"));
    com.pedroza.parking.api.domain.ParkingLot lot = lotRepo.findById(spot.getParkingLotId()).orElseThrow(() -> new NotFoundException("parking_lot_not_found"));
    BigDecimal total = lot.getHourlyRate().multiply(BigDecimal.valueOf(hours));
    record.setExitTime(now);
    record.setCalculatedAmount(total);
    record.setIsPaid(true);
    recordRepo.save(record);
    Payment payment = new Payment();
    payment.setParkingRecordId(record.getId());
    payment.setUserId(record.getRegisteredBy());
    payment.setAmount(total);
    payment.setPaymentMethod(PaymentMethod.valueOf(req.paymentMethod));
    payment.setPaymentStatus(PaymentStatus.completed);
    payment.setInvoiceNumber("INV-" + System.currentTimeMillis());
    paymentRepo.save(payment);
    spot.setIsAvailable(true);
    spotRepo.save(spot);
    return record;
  }

  public List<ActiveRecordResponse> listActive() {
    List<ParkingRecord> records = recordRepo.findByExitTimeIsNull();
    List<ActiveRecordResponse> result = new ArrayList<>();
    for (ParkingRecord r : records) {
      ParkingSpot spot = spotRepo.findById(r.getParkingSpotId()).orElse(null);
      ActiveRecordResponse dto = new ActiveRecordResponse();
      dto.id = r.getId();
      dto.vehicle_plate = r.getVehiclePlate();
      dto.vehicle_type = "unknown";
      dto.entry_time = r.getEntryTime().toString();
      dto.parking_spot_id = r.getParkingSpotId();
      dto.spot_number = spot != null ? spot.getSpotNumber() : null;
      if (spot != null) {
        com.pedroza.parking.api.domain.ParkingLot lot = lotRepo.findById(spot.getParkingLotId()).orElse(null);
        dto.parking_lot_name = lot != null ? lot.getName() : null;
        dto.hourly_rate = lot != null ? lot.getHourlyRate() : java.math.BigDecimal.ZERO;
      } else {
        dto.parking_lot_name = null;
        dto.hourly_rate = java.math.BigDecimal.ZERO;
      }
      result.add(dto);
    }
    return result;
  }
}
