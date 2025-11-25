package com.pedroza.parking.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<?> handleNotFound(NotFoundException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<?> handleConflict(ConflictException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", ex.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "validation_error");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }
}

