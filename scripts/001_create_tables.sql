-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'employee', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de parqueaderos
CREATE TABLE IF NOT EXISTS public.parking_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  total_spots INTEGER NOT NULL DEFAULT 0,
  hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  opening_time TIME NOT NULL DEFAULT '06:00',
  closing_time TIME NOT NULL DEFAULT '22:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de espacios de estacionamiento
CREATE TABLE IF NOT EXISTS public.parking_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parking_lot_id UUID NOT NULL REFERENCES public.parking_lots(id) ON DELETE CASCADE,
  spot_number TEXT NOT NULL,
  spot_type TEXT NOT NULL DEFAULT 'standard' CHECK (spot_type IN ('standard', 'handicapped', 'motorcycle', 'electric')),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parking_lot_id, spot_number)
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parking_spot_id UUID NOT NULL REFERENCES public.parking_spots(id) ON DELETE CASCADE,
  vehicle_plate TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de registros de entrada/salida (para empleados)
CREATE TABLE IF NOT EXISTS public.parking_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
  parking_spot_id UUID NOT NULL REFERENCES public.parking_spots(id) ON DELETE CASCADE,
  vehicle_plate TEXT NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exit_time TIMESTAMPTZ,
  calculated_amount DECIMAL(10,2),
  is_paid BOOLEAN DEFAULT false,
  registered_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pagos/facturas
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
  parking_record_id UUID REFERENCES public.parking_records(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'transfer')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  invoice_number TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para parking_lots (todos pueden ver, solo admins pueden modificar)
CREATE POLICY "parking_lots_select_all" ON public.parking_lots FOR SELECT USING (true);
CREATE POLICY "parking_lots_insert_admin" ON public.parking_lots FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "parking_lots_update_admin" ON public.parking_lots FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "parking_lots_delete_admin" ON public.parking_lots FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Políticas RLS para parking_spots (todos pueden ver)
CREATE POLICY "parking_spots_select_all" ON public.parking_spots FOR SELECT USING (true);
CREATE POLICY "parking_spots_insert_admin" ON public.parking_spots FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "parking_spots_update_admin_employee" ON public.parking_spots FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));

-- Políticas RLS para reservations
CREATE POLICY "reservations_select_own" ON public.reservations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "reservations_select_employee" ON public.reservations FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));
CREATE POLICY "reservations_insert_own" ON public.reservations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reservations_update_own" ON public.reservations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "reservations_update_employee" ON public.reservations FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));

-- Políticas RLS para parking_records (empleados y admins)
CREATE POLICY "parking_records_select_employee" ON public.parking_records FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));
CREATE POLICY "parking_records_insert_employee" ON public.parking_records FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));
CREATE POLICY "parking_records_update_employee" ON public.parking_records FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));

-- Políticas RLS para payments
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "payments_select_employee" ON public.payments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));
CREATE POLICY "payments_insert_employee" ON public.payments FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));
CREATE POLICY "payments_update_employee" ON public.payments FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));
