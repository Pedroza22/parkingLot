package com.pedroza.parking.api.dto;

import jakarta.validation.constraints.*;

public class UpdateParkingLotRequest {
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
}

