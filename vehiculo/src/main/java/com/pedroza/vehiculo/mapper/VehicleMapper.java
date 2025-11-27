package com.pedroza.vehiculo.mapper;

import com.pedroza.vehiculo.domain.Vehicle;
import com.pedroza.vehiculo.dto.CreateVehicleRequest;
import com.pedroza.vehiculo.dto.UpdateVehicleRequest;
import com.pedroza.vehiculo.dto.VehicleResponse;

public final class VehicleMapper {
    private VehicleMapper() {}

    public static Vehicle toDocument(CreateVehicleRequest req) {
        Vehicle v = new Vehicle();
        v.setBrand(req.getBrand());
        v.setModel(req.getModel());
        v.setYear(req.getYear());
        v.setVin(req.getVin());
        v.setColor(req.getColor());
        v.setPrice(req.getPrice());
        return v;
    }

    public static void apply(UpdateVehicleRequest req, Vehicle v) {
        v.setBrand(req.getBrand());
        v.setModel(req.getModel());
        v.setYear(req.getYear());
        v.setVin(req.getVin());
        v.setColor(req.getColor());
        v.setPrice(req.getPrice());
    }

    public static VehicleResponse toResponse(Vehicle v) {
        VehicleResponse r = new VehicleResponse();
        r.setId(v.getId());
        r.setBrand(v.getBrand());
        r.setModel(v.getModel());
        r.setYear(v.getYear());
        r.setVin(v.getVin());
        r.setColor(v.getColor());
        r.setPrice(v.getPrice());
        return r;
    }
}