package com.pedroza.parking.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pedroza.parking.api.domain.Reservation;

public interface ReservationRepository extends MongoRepository<Reservation, String> {}
