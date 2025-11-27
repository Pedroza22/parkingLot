package com.pedroza.vehiculo.repository;

import com.pedroza.vehiculo.domain.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    boolean existsByVin(String vin);
    Optional<Vehicle> findByVin(String vin);
}