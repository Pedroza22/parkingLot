package com.pedroza.parking.api.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payments")
public class Payment {
  @Id
  private String id = java.util.UUID.randomUUID().toString();
  private String reservationId;
  private String parkingRecordId;
  private String userId;
  private BigDecimal amount;
  private PaymentMethod paymentMethod = PaymentMethod.cash;
  private PaymentStatus paymentStatus = PaymentStatus.pending;
  private String invoiceNumber;
  private OffsetDateTime createdAt = OffsetDateTime.now();

  public String getId() { return id; }
  public String getReservationId() { return reservationId; }
  public void setReservationId(String reservationId) { this.reservationId = reservationId; }
  public String getParkingRecordId() { return parkingRecordId; }
  public void setParkingRecordId(String parkingRecordId) { this.parkingRecordId = parkingRecordId; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }
  public PaymentMethod getPaymentMethod() { return paymentMethod; }
  public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
  public PaymentStatus getPaymentStatus() { return paymentStatus; }
  public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
  public String getInvoiceNumber() { return invoiceNumber; }
  public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
