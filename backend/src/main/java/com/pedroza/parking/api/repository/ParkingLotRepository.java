package com.pedroza.parking.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pedroza.parking.api.domain.ParkingLot;

public interface ParkingLotRepository extends MongoRepository<ParkingLot, String> {}
