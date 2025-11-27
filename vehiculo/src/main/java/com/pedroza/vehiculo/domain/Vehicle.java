package com.pedroza.vehiculo.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection = "vehiculos")
public class Vehicle {
    @Id
    private String id;
    private String brand;
    private String model;
    private Integer year;
    @Indexed(unique = true)
    private String vin;
    private String color;
    private BigDecimal price;

    public Vehicle() {
    }

    public Vehicle(String id, String brand, String model, Integer year, String vin, String color, BigDecimal price) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.vin = vin;
        this.color = color;
        this.price = price;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}