package com.pedroza.vehiculo.service;

import com.pedroza.vehiculo.domain.Vehicle;
import com.pedroza.vehiculo.dto.CreateVehicleRequest;
import com.pedroza.vehiculo.dto.UpdateVehicleRequest;
import com.pedroza.vehiculo.dto.VehicleResponse;
import com.pedroza.vehiculo.exception.ConflictException;
import com.pedroza.vehiculo.exception.NotFoundException;
import com.pedroza.vehiculo.mapper.VehicleMapper;
import com.pedroza.vehiculo.repository.VehicleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository repository;

    public VehicleServiceImpl(VehicleRepository repository) {
        this.repository = repository;
    }

    @Override
    public VehicleResponse create(CreateVehicleRequest request) {
        if (repository.existsByVin(request.getVin())) {
            throw new ConflictException("El VIN ya existe");
        }
        Vehicle v = VehicleMapper.toDocument(request);
        v = repository.save(v);
        return VehicleMapper.toResponse(v);
    }

    @Override
    public VehicleResponse findById(String id) {
        Vehicle v = repository.findById(id).orElseThrow(() -> new NotFoundException("Vehículo no encontrado"));
        return VehicleMapper.toResponse(v);
    }

    @Override
    public Page<VehicleResponse> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(VehicleMapper::toResponse);
    }

    @Override
    public VehicleResponse update(String id, UpdateVehicleRequest request) {
        Vehicle v = repository.findById(id).orElseThrow(() -> new NotFoundException("Vehículo no encontrado"));
        if (!v.getVin().equals(request.getVin()) && repository.existsByVin(request.getVin())) {
            throw new ConflictException("El VIN ya existe");
        }
        VehicleMapper.apply(request, v);
        v = repository.save(v);
        return VehicleMapper.toResponse(v);
    }

    @Override
    public void delete(String id) {
        Vehicle v = repository.findById(id).orElseThrow(() -> new NotFoundException("Vehículo no encontrado"));
        repository.delete(v);
    }
}