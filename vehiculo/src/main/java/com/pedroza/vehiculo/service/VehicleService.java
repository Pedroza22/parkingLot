package com.pedroza.vehiculo.service;

import com.pedroza.vehiculo.dto.CreateVehicleRequest;
import com.pedroza.vehiculo.dto.UpdateVehicleRequest;
import com.pedroza.vehiculo.dto.VehicleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleService {
    VehicleResponse create(CreateVehicleRequest request);
    VehicleResponse findById(String id);
    Page<VehicleResponse> findAll(Pageable pageable);
    VehicleResponse update(String id, UpdateVehicleRequest request);
    void delete(String id);
}