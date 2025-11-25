package com.pedroza.parking.api.dto;

import jakarta.validation.constraints.*;

public class CreateParkingLotRequest {
  @NotBlank
  public String name;
  @NotBlank
  public String address;
  @NotBlank
  public String city;
  @NotNull
  @PositiveOrZero
  public Double hourlyRate;
  @NotBlank
  public String openingTime;
  @NotBlank
  public String closingTime;
  public Boolean isActive = true;
  @PositiveOrZero
  public Integer standardSpots = 0;
  @PositiveOrZero
  public Integer motorcycleSpots = 0;
  @PositiveOrZero
  public Integer handicappedSpots = 0;
  @PositiveOrZero
  public Integer electricSpots = 0;
}

