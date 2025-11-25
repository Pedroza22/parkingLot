package com.pedroza.parking.api.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pedroza.parking.api.domain.ParkingRecord;

public interface ParkingRecordRepository extends MongoRepository<ParkingRecord, String> {
  List<ParkingRecord> findByExitTimeIsNull();
}
