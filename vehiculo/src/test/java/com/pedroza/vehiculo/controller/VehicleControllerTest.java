package com.pedroza.vehiculo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pedroza.vehiculo.dto.CreateVehicleRequest;
import com.pedroza.vehiculo.dto.VehicleResponse;
import com.pedroza.vehiculo.service.VehicleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = VehicleController.class)
class VehicleControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VehicleService service;

    @Autowired
    private ObjectMapper mapper;

    @Test
    void create_returns_201() throws Exception {
        CreateVehicleRequest req = new CreateVehicleRequest();
        req.setBrand("Ford");
        req.setModel("Focus");
        req.setYear(2020);
        req.setVin("VIN123456");
        req.setPrice(new BigDecimal("10000"));

        VehicleResponse resp = new VehicleResponse();
        resp.setId("abc123");
        resp.setBrand("Ford");

        when(service.create(any(CreateVehicleRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/v1/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/v1/vehicles/abc123"));
    }

    @Test
    void create_validation_error_400() throws Exception {
        CreateVehicleRequest req = new CreateVehicleRequest();
        req.setBrand("");
        req.setModel("");
        req.setYear(1800);
        req.setVin("");

        mockMvc.perform(post("/api/v1/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}