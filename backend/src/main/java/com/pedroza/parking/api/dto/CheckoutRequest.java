package com.pedroza.parking.api.dto;

import jakarta.validation.constraints.*;

public class CheckoutRequest {
  @NotBlank
  public String paymentMethod;
}

