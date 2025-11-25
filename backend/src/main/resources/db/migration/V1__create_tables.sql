CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS parking_lots (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  total_spots INTEGER NOT NULL DEFAULT 0,
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  opening_time TIME NOT NULL DEFAULT '06:00',
  closing_time TIME NOT NULL DEFAULT '22:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parking_spots (
  id UUID PRIMARY KEY,
  parking_lot_id UUID NOT NULL REFERENCES parking_lots(id) ON DELETE CASCADE,
  spot_number TEXT NOT NULL,
  spot_type TEXT NOT NULL CHECK (spot_type IN ('standard','handicapped','motorcycle','electric')),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parking_lot_id, spot_number)
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  parking_spot_id UUID NOT NULL REFERENCES parking_spots(id) ON DELETE CASCADE,
  vehicle_plate TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','confirmed','active','completed','cancelled')),
  total_amount NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parking_records (
  id UUID PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  parking_spot_id UUID NOT NULL REFERENCES parking_spots(id) ON DELETE CASCADE,
  vehicle_plate TEXT NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exit_time TIMESTAMPTZ,
  calculated_amount NUMERIC(10,2),
  is_paid BOOLEAN DEFAULT false,
  registered_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  parking_record_id UUID REFERENCES parking_records(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash','card','transfer')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending','completed','failed','refunded')),
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

