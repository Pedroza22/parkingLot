package com.pedroza.parking.api.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reservations")
public class Reservation {
  @Id
  private String id = java.util.UUID.randomUUID().toString();
  private String userId;
  private String parkingSpotId;
  private String vehiclePlate;
  private OffsetDateTime startTime;
  private OffsetDateTime endTime;
  private ReservationStatus status = ReservationStatus.pending;
  private BigDecimal totalAmount;
  private OffsetDateTime createdAt = OffsetDateTime.now();
  private OffsetDateTime updatedAt = OffsetDateTime.now();

  public String getId() { return id; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getParkingSpotId() { return parkingSpotId; }
  public void setParkingSpotId(String parkingSpotId) { this.parkingSpotId = parkingSpotId; }
  public String getVehiclePlate() { return vehiclePlate; }
  public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }
  public OffsetDateTime getStartTime() { return startTime; }
  public void setStartTime(OffsetDateTime startTime) { this.startTime = startTime; }
  public OffsetDateTime getEndTime() { return endTime; }
  public void setEndTime(OffsetDateTime endTime) { this.endTime = endTime; }
  public ReservationStatus getStatus() { return status; }
  public void setStatus(ReservationStatus status) { this.status = status; }
  public BigDecimal getTotalAmount() { return totalAmount; }
  public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
  public OffsetDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
