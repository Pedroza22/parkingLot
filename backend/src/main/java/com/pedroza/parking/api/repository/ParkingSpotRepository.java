package com.pedroza.parking.api.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pedroza.parking.api.domain.ParkingSpot;

public interface ParkingSpotRepository extends MongoRepository<ParkingSpot, String> {
  List<ParkingSpot> findByParkingLotIdAndIsAvailableTrue(String parkingLotId);
  List<ParkingSpot> findByParkingLotId(String parkingLotId);
}
