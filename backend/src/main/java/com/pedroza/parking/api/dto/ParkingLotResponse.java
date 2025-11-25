package com.pedroza.parking.api.dto;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Map;

public class ParkingLotResponse {
  public String id;
  public String name;
  public String address;
  public String city;
  public BigDecimal hourlyRate;
  public LocalTime openingTime;
  public LocalTime closingTime;
  public Boolean isActive;
  public Integer availableSpots;
  public Integer totalSpots;
  public Map<String, Integer> spotTypes;
}
