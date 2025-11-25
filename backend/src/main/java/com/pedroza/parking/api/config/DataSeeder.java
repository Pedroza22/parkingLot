package com.pedroza.parking.api.config;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;

import com.pedroza.parking.api.domain.ParkingLot;
import com.pedroza.parking.api.domain.ParkingSpot;
import com.pedroza.parking.api.domain.SpotType;
import com.pedroza.parking.api.repository.ParkingLotRepository;
import com.pedroza.parking.api.repository.ParkingSpotRepository;

@Configuration
public class DataSeeder {
  @Bean
  CommandLineRunner seed(ParkingLotRepository lotRepo, ParkingSpotRepository spotRepo) {
    return args -> {
      if (lotRepo.count() == 0) {
        ParkingLot lot = new ParkingLot();
        lot.setName("Centro");
        lot.setAddress("Cra 1 # 2-3");
        lot.setCity("Bogotá");
        lot.setHourlyRate(BigDecimal.valueOf(5000));
        lot.setOpeningTime(LocalTime.of(6, 0));
        lot.setClosingTime(LocalTime.of(22, 0));
        lot.setIsActive(true);
        lot.setTotalSpots(12);
        lot = lotRepo.save(lot);

        List<ParkingSpot> spots = new ArrayList<>();
        for (int i = 1; i <= 6; i++) {
          ParkingSpot s = new ParkingSpot();
          s.setParkingLotId(lot.getId());
          s.setSpotNumber("A-" + String.format("%03d", i));
          s.setSpotType(SpotType.standard);
          spots.add(s);
        }
        for (int i = 1; i <= 3; i++) {
          ParkingSpot s = new ParkingSpot();
          s.setParkingLotId(lot.getId());
          s.setSpotNumber("M-" + String.format("%03d", i));
          s.setSpotType(SpotType.motorcycle);
          spots.add(s);
        }
        for (int i = 1; i <= 2; i++) {
          ParkingSpot s = new ParkingSpot();
          s.setParkingLotId(lot.getId());
          s.setSpotNumber("H-" + String.format("%03d", i));
          s.setSpotType(SpotType.handicapped);
          spots.add(s);
        }
        for (int i = 1; i <= 1; i++) {
          ParkingSpot s = new ParkingSpot();
          s.setParkingLotId(lot.getId());
          s.setSpotNumber("E-" + String.format("%03d", i));
          s.setSpotType(SpotType.electric);
          spots.add(s);
        }
        spotRepo.saveAll(spots);
      }
    };
  }
}

