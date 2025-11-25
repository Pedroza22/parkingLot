export type UserRole = "user" | "employee" | "admin"

export interface Profile {
  id: string
  email: string
  full_name: string
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface ParkingLot {
  id: string
  name: string
  address: string
  city: string
  total_spots: number
  hourly_rate: number
  opening_time: string
  closing_time: string
  is_active: boolean
  created_at: string
  updated_at: string
  available_spots?: number
}

export interface ParkingSpot {
  id: string
  parking_lot_id: string
  spot_number: string
  spot_type: "standard" | "handicapped" | "motorcycle" | "electric"
  is_available: boolean
  created_at: string
  parking_lot?: ParkingLot
}

export interface Reservation {
  id: string
  user_id: string
  parking_spot_id: string
  vehicle_plate: string
  start_time: string
  end_time: string
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  total_amount: number | null
  created_at: string
  updated_at: string
  parking_spot?: ParkingSpot
  profile?: Profile
}

export interface ParkingRecord {
  id: string
  reservation_id: string | null
  parking_spot_id: string
  vehicle_plate: string
  entry_time: string
  exit_time: string | null
  calculated_amount: number | null
  is_paid: boolean
  registered_by: string | null
  created_at: string
  parking_spot?: ParkingSpot
  reservation?: Reservation
}

export interface Payment {
  id: string
  reservation_id: string | null
  parking_record_id: string | null
  user_id: string
  amount: number
  payment_method: "cash" | "card" | "transfer"
  payment_status: "pending" | "completed" | "failed" | "refunded"
  invoice_number: string | null
  created_at: string
}
