package com.pedroza.vehiculo.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class UpdateVehicleRequest {
    @NotBlank
    @Size(max = 50)
    private String brand;

    @NotBlank
    @Size(max = 50)
    private String model;

    @NotNull
    @Min(1900)
    @Max(2100)
    private Integer year;

    @NotBlank
    @Size(min = 6, max = 30)
    private String vin;

    @Size(max = 30)
    private String color;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}