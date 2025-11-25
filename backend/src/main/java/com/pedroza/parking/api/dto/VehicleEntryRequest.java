package com.pedroza.parking.api.dto;

import jakarta.validation.constraints.NotBlank;

public class VehicleEntryRequest {
  @NotBlank
  public String parkingSpotId;
  @NotBlank
  public String vehiclePlate;
  @NotBlank
  public String vehicleType;
  @NotBlank
  public String registeredBy;
}
