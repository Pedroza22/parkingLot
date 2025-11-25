package com.pedroza.parking.api.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "parking_records")
public class ParkingRecord {
  @Id
  private String id = java.util.UUID.randomUUID().toString();
  private String reservationId;
  private String parkingSpotId;
  private String vehiclePlate;
  private OffsetDateTime entryTime = OffsetDateTime.now();
  private OffsetDateTime exitTime;
  private BigDecimal calculatedAmount;
  private Boolean isPaid = false;
  private String registeredBy;
  private OffsetDateTime createdAt = OffsetDateTime.now();

  public String getId() { return id; }
  public String getReservationId() { return reservationId; }
  public void setReservationId(String reservationId) { this.reservationId = reservationId; }
  public String getParkingSpotId() { return parkingSpotId; }
  public void setParkingSpotId(String parkingSpotId) { this.parkingSpotId = parkingSpotId; }
  public String getVehiclePlate() { return vehiclePlate; }
  public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }
  public OffsetDateTime getEntryTime() { return entryTime; }
  public void setEntryTime(OffsetDateTime entryTime) { this.entryTime = entryTime; }
  public OffsetDateTime getExitTime() { return exitTime; }
  public void setExitTime(OffsetDateTime exitTime) { this.exitTime = exitTime; }
  public BigDecimal getCalculatedAmount() { return calculatedAmount; }
  public void setCalculatedAmount(BigDecimal calculatedAmount) { this.calculatedAmount = calculatedAmount; }
  public Boolean getIsPaid() { return isPaid; }
  public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }
  public String getRegisteredBy() { return registeredBy; }
  public void setRegisteredBy(String registeredBy) { this.registeredBy = registeredBy; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
