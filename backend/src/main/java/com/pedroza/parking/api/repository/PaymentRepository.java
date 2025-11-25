package com.pedroza.parking.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pedroza.parking.api.domain.Payment;

public interface PaymentRepository extends MongoRepository<Payment, String> {}
