package com.pedroza.parking.api.domain;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "parking_lots")
public class ParkingLot {
  @Id
  private String id = java.util.UUID.randomUUID().toString();
  private String name;
  private String address;
  private String city;
  private Integer totalSpots = 0;
  private BigDecimal hourlyRate = BigDecimal.ZERO;
  private LocalTime openingTime = LocalTime.of(6, 0);
  private LocalTime closingTime = LocalTime.of(22, 0);
  private Boolean isActive = true;
  private OffsetDateTime createdAt = OffsetDateTime.now();
  private OffsetDateTime updatedAt = OffsetDateTime.now();

  public String getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }
  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }
  public Integer getTotalSpots() { return totalSpots; }
  public void setTotalSpots(Integer totalSpots) { this.totalSpots = totalSpots; }
  public BigDecimal getHourlyRate() { return hourlyRate; }
  public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
  public LocalTime getOpeningTime() { return openingTime; }
  public void setOpeningTime(LocalTime openingTime) { this.openingTime = openingTime; }
  public LocalTime getClosingTime() { return closingTime; }
  public void setClosingTime(LocalTime closingTime) { this.closingTime = closingTime; }
  public Boolean getIsActive() { return isActive; }
  public void setIsActive(Boolean isActive) { this.isActive = isActive; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
  public OffsetDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
