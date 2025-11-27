package com.pedroza.vehiculo.dto;

import java.math.BigDecimal;

public class VehicleResponse {
    private String id;
    private String brand;
    private String model;
    private Integer year;
    private String vin;
    private String color;
    private BigDecimal price;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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