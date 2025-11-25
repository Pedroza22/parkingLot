INSERT INTO parking_lots(id, name, address, city, total_spots, hourly_rate, opening_time, closing_time)
VALUES (
  uuid_generate_v4(), 'Parqueadero Central', 'Calle 50 #10-20', 'Bogotá', 50, 5000, '06:00', '22:00'
), (
  uuid_generate_v4(), 'Parqueadero Norte', 'Carrera 15 #80-45', 'Bogotá', 30, 4500, '00:00', '23:59'
), (
  uuid_generate_v4(), 'Parqueadero Sur', 'Avenida 68 #30-10', 'Bogotá', 40, 4000, '07:00', '21:00'
);

