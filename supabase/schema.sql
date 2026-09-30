-- ========================================================
-- GearUp Automotive Platform: Supabase PostgreSQL Schema
-- ========================================================

-- 1. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  reg_number TEXT NOT NULL UNIQUE,
  fuel_type TEXT NOT NULL,
  current_km INT NOT NULL DEFAULT 0,
  last_service_km INT NOT NULL DEFAULT 0,
  next_service_due_km INT NOT NULL DEFAULT 10000,
  health_score INT NOT NULL DEFAULT 100,
  insurance_expiry DATE,
  pollution_expiry DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MECHANIC SHOPS TABLE
CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.8,
  reviews_count INT DEFAULT 0,
  distance_km NUMERIC(4,1) DEFAULT 3.0,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_open_now BOOLEAN DEFAULT TRUE,
  is_emergency_capable BOOLEAN DEFAULT TRUE,
  active_bays INT DEFAULT 2,
  total_bays INT DEFAULT 4,
  supported_makes JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  vehicle_info JSONB NOT NULL,
  shop_id TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, in_progress, ready_for_pickup, completed, declined
  scheduled_time TEXT NOT NULL,
  logged_odometer INT,
  parts_replaced JSONB DEFAULT '[]'::jsonb,
  labor_charge INT DEFAULT 0,
  notes TEXT,
  completion_otp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRANE TOW DISPATCHES TABLE
CREATE TABLE IF NOT EXISTS tow_dispatches (
  id TEXT PRIMARY KEY,
  dispatch_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  vehicle_info JSONB NOT NULL,
  pickup_address TEXT NOT NULL,
  destination_shop_id TEXT NOT NULL,
  destination_shop_name TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  distance_km NUMERIC(5,1) NOT NULL,
  base_fare INT NOT NULL DEFAULT 1500,
  per_km_rate INT NOT NULL DEFAULT 65,
  total_fare INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'dispatched', -- dispatched, arrived, loaded, handover_pending, completed
  photos JSONB DEFAULT '{}'::jsonb,
  handover_otp TEXT,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  truck_plate TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MAINTENANCE TASKS TABLE
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  title TEXT NOT NULL,
  interval_km INT NOT NULL,
  last_done_km INT NOT NULL,
  due_km INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'good',
  estimated_cost INT NOT NULL,
  description TEXT
);

-- Enable Row Level Security (RLS) but allow anonymous operations for demo/presentation access
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tow_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public select vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public insert vehicles" ON vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update vehicles" ON vehicles FOR UPDATE USING (true);

CREATE POLICY "Public select shops" ON shops FOR SELECT USING (true);
CREATE POLICY "Public insert shops" ON shops FOR INSERT WITH CHECK (true);

CREATE POLICY "Public select bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update bookings" ON bookings FOR UPDATE USING (true);

CREATE POLICY "Public select tow_dispatches" ON tow_dispatches FOR SELECT USING (true);
CREATE POLICY "Public insert tow_dispatches" ON tow_dispatches FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tow_dispatches" ON tow_dispatches FOR UPDATE USING (true);

CREATE POLICY "Public select maintenance_tasks" ON maintenance_tasks FOR SELECT USING (true);

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Insert Initial Vehicles
INSERT INTO vehicles (id, make, model, year, reg_number, fuel_type, current_km, last_service_km, next_service_due_km, health_score, insurance_expiry, pollution_expiry)
VALUES
('veh-1', 'Volkswagen', 'Polo GT TSI', 2021, 'KL 07 CD 4488', 'Petrol', 42350, 35000, 45000, 84, '2026-11-15', '2026-10-20'),
('veh-2', 'Hyundai', 'Creta SX(O)', 2022, 'KL 01 BY 9012', 'Diesel', 28120, 20000, 30000, 92, '2027-04-10', '2027-01-05')
ON CONFLICT (reg_number) DO NOTHING;

-- Insert Initial Garages
INSERT INTO shops (id, name, rating, reviews_count, distance_km, address, phone, is_open_now, is_emergency_capable, active_bays, total_bays, supported_makes, services)
VALUES
('shop-1', 'Apex Auto Precision & Diagnostics', 4.9, 184, 2.4, 'Kaloor - Kadavanthra Rd, Kochi, Kerala', '+91 98470 11223', true, true, 3, 5,
 '["Volkswagen", "Skoda", "Audi", "BMW", "Hyundai", "Toyota"]'::jsonb,
 '[
   {"id": "s-1", "name": "Comprehensive Periodic Service", "category": "Periodic", "price": 4200, "durationMinutes": 180},
   {"id": "s-2", "name": "Brake Overhaul & Fluid Bleeding", "category": "Brakes", "price": 1800, "durationMinutes": 90},
   {"id": "s-3", "name": "Computerised OBD-II Diagnostic Scan", "category": "Electrical", "price": 950, "durationMinutes": 45},
   {"id": "s-4", "name": "Suspension Bushing & Strut Refresh", "category": "Suspension", "price": 3400, "durationMinutes": 240}
 ]'::jsonb
),
('shop-2', 'SpeedCraft Motor Works', 4.7, 96, 4.1, 'NH 66 Bypass, Edappally, Kochi, Kerala', '+91 97455 33441', true, true, 2, 4,
 '["Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda"]'::jsonb,
 '[
   {"id": "s-5", "name": "Express Oil Service", "category": "Periodic", "price": 2800, "durationMinutes": 75},
   {"id": "s-6", "name": "Clutch Plate & Flywheel Overhaul", "category": "Engine", "price": 5500, "durationMinutes": 300},
   {"id": "s-7", "name": "Cooling System Flush & Radiator Leak Test", "category": "Engine", "price": 1500, "durationMinutes": 60}
 ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Tow Dispatches
INSERT INTO tow_dispatches (id, dispatch_number, customer_id, customer_phone, vehicle_info, pickup_address, destination_shop_id, destination_shop_name, destination_address, distance_km, base_fare, per_km_rate, total_fare, status, photos, handover_otp, driver_name, driver_phone, truck_plate)
VALUES
('tow-501', 'TOW-2026-049', 'cust-3', '+91 97441 55667',
 '{"make": "Skoda", "model": "Octavia vRS", "regNumber": "KL 07 BR 3322", "condition": "severe_damage"}'::jsonb,
 'Near Container Terminal Rd, Kalamassery, Kochi', 'shop-1', 'Apex Auto Precision & Diagnostics', 'Kaloor - Kadavanthra Rd, Kochi', 8.4, 1500, 65, 2046, 'en_route',
 '{"front": true, "rear": true, "left": true, "right": false}'::jsonb,
 '8319', 'Fleet Unit #4 (Hydraulic Bed)', '+91 98460 77112', 'KL 07 CW 9901')
ON CONFLICT (id) DO NOTHING;
