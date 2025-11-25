-- Insertar parqueaderos de ejemplo
INSERT INTO public.parking_lots (name, address, city, total_spots, hourly_rate, opening_time, closing_time) VALUES
('Parqueadero Central', 'Calle 50 #10-20', 'Bogotá', 50, 5000, '06:00', '22:00'),
('Parqueadero Norte', 'Carrera 15 #80-45', 'Bogotá', 30, 4500, '00:00', '23:59'),
('Parqueadero Sur', 'Avenida 68 #30-10', 'Bogotá', 40, 4000, '07:00', '21:00');

-- Insertar espacios para Parqueadero Central
INSERT INTO public.parking_spots (parking_lot_id, spot_number, spot_type)
SELECT 
  (SELECT id FROM public.parking_lots WHERE name = 'Parqueadero Central'),
  'A' || LPAD(n::TEXT, 2, '0'),
  CASE 
    WHEN n <= 2 THEN 'handicapped'
    WHEN n <= 5 THEN 'motorcycle'
    ELSE 'standard'
  END
FROM generate_series(1, 20) AS n;

-- Insertar espacios para Parqueadero Norte
INSERT INTO public.parking_spots (parking_lot_id, spot_number, spot_type)
SELECT 
  (SELECT id FROM public.parking_lots WHERE name = 'Parqueadero Norte'),
  'B' || LPAD(n::TEXT, 2, '0'),
  CASE 
    WHEN n <= 2 THEN 'electric'
    WHEN n <= 4 THEN 'motorcycle'
    ELSE 'standard'
  END
FROM generate_series(1, 15) AS n;

-- Insertar espacios para Parqueadero Sur
INSERT INTO public.parking_spots (parking_lot_id, spot_number, spot_type)
SELECT 
  (SELECT id FROM public.parking_lots WHERE name = 'Parqueadero Sur'),
  'C' || LPAD(n::TEXT, 2, '0'),
  'standard'
FROM generate_series(1, 15) AS n;
