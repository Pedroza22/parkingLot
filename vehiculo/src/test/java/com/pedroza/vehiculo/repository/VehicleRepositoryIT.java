package com.pedroza.vehiculo.repository;

import com.pedroza.vehiculo.domain.Vehicle;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
class VehicleRepositoryIT {
    @Autowired
    private VehicleRepository repository;

    @Test
    void save_and_find() {
        Vehicle v = new Vehicle();
        v.setBrand("Toyota");
        v.setModel("Corolla");
        v.setYear(2019);
        v.setVin("VIN-IT-001");
        v.setColor("Gray");
        v.setPrice(new BigDecimal("15000"));

        Vehicle saved = repository.save(v);
        assertNotNull(saved.getId());

        var byId = repository.findById(saved.getId());
        assertTrue(byId.isPresent());
        assertEquals("Toyota", byId.get().getBrand());
    }
}