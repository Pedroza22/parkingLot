package com.pedroza.parking.api.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateReservationRequest {
  @NotBlank
  public String userId;
  @NotBlank
  public String parkingSpotId;
  @NotBlank
  public String vehiclePlate;
  @NotBlank
  public String startTime;
  @NotBlank
  public String endTime;
}
