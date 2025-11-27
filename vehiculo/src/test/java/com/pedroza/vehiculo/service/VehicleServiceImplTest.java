package com.pedroza.vehiculo.service;

import com.pedroza.vehiculo.domain.Vehicle;
import com.pedroza.vehiculo.dto.CreateVehicleRequest;
import com.pedroza.vehiculo.dto.UpdateVehicleRequest;
import com.pedroza.vehiculo.exception.ConflictException;
import com.pedroza.vehiculo.exception.NotFoundException;
import com.pedroza.vehiculo.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class VehicleServiceImplTest {
    private VehicleRepository repository;
    private VehicleService service;

    @BeforeEach
    void setup() {
        repository = Mockito.mock(VehicleRepository.class);
        service = new VehicleServiceImpl(repository);
    }

    @Test
    void create_ok() {
        CreateVehicleRequest req = new CreateVehicleRequest();
        req.setBrand("Ford");
        req.setModel("Focus");
        req.setYear(2020);
        req.setVin("VIN123456");
        req.setColor("Blue");
        req.setPrice(new BigDecimal("10000"));

        when(repository.existsByVin("VIN123456")).thenReturn(false);
        when(repository.save(any(Vehicle.class))).thenAnswer(inv -> {
            Vehicle v = inv.getArgument(0);
            v.setId("abc123");
            return v;
        });

        var res = service.create(req);
        assertEquals("abc123", res.getId());
        verify(repository).save(any(Vehicle.class));
    }

    @Test
    void create_conflict_vin() {
        CreateVehicleRequest req = new CreateVehicleRequest();
        req.setBrand("Ford");
        req.setModel("Focus");
        req.setYear(2020);
        req.setVin("VIN123456");

        when(repository.existsByVin("VIN123456")).thenReturn(true);
        assertThrows(ConflictException.class, () -> service.create(req));
    }

    @Test
    void findAll_paged() {
        when(repository.findAll(any(PageRequest.class))).thenReturn(new PageImpl<>(java.util.List.of(new Vehicle())));
        var page = service.findAll(PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
    }

    @Test
    void update_ok() {
        UpdateVehicleRequest req = new UpdateVehicleRequest();
        req.setBrand("Ford");
        req.setModel("Fiesta");
        req.setYear(2021);
        req.setVin("VIN999");
        req.setColor("Red");
        req.setPrice(new BigDecimal("12000"));

        Vehicle existing = new Vehicle();
        existing.setId("abc");
        existing.setVin("VIN123");
        when(repository.findById("abc")).thenReturn(Optional.of(existing));
        when(repository.existsByVin("VIN999")).thenReturn(false);
        when(repository.save(any(Vehicle.class))).thenAnswer(inv -> inv.getArgument(0));

        var res = service.update("abc", req);
        assertEquals("VIN999", res.getVin());
    }

    @Test
    void delete_not_found() {
        when(repository.findById("missing")).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> service.delete("missing"));
    }
}