package com.pedroza.parking.api.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.OffsetDateTime;

@Document(collection = "parking_spots")
@CompoundIndex(name = "lot_spot_unique", def = "{ 'parkingLotId': 1, 'spotNumber': 1 }", unique = true)
public class ParkingSpot {
  @Id
  private String id = java.util.UUID.randomUUID().toString();
  private String parkingLotId;
  private String spotNumber;
  private SpotType spotType = SpotType.standard;
  private Boolean isAvailable = true;
  private OffsetDateTime createdAt = OffsetDateTime.now();

  public String getId() { return id; }
  public String getParkingLotId() { return parkingLotId; }
  public void setParkingLotId(String parkingLotId) { this.parkingLotId = parkingLotId; }
  public String getSpotNumber() { return spotNumber; }
  public void setSpotNumber(String spotNumber) { this.spotNumber = spotNumber; }
  public SpotType getSpotType() { return spotType; }
  public void setSpotType(SpotType spotType) { this.spotType = spotType; }
  public Boolean getIsAvailable() { return isAvailable; }
  public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
