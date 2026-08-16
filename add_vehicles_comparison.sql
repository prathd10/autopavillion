-- ============================================================
--  AUTO PAVILION — Vehicle Comparison System Setup
--  File: add_vehicles_comparison.sql
-- ============================================================

-- ── 1. VEHICLES CATALOGUE TABLE (CACHING LAYER) ──────────────

CREATE TABLE IF NOT EXISTS public.vehicles (
  -- Identity
  id                    text        PRIMARY KEY,
  vehiclesdb_id         text        UNIQUE,
  make                  text        NOT NULL,
  model                 text        NOT NULL,
  generation            text,
  year                  int,
  variant               text,
  trim                  text,
  
  -- Technical specs
  body_type             text,
  fuel_type             text,
  engine                text,
  engine_displacement   text,
  cylinders             text,
  horsepower            text,
  torque                text,
  transmission          text,
  drivetrain            text,
  acceleration          text,
  top_speed             text,
  fuel_economy          text,
  
  -- Dimensions
  length                text,
  width                 text,
  height                text,
  wheelbase             text,
  ground_clearance      text,
  
  -- Practicality
  boot_capacity         text,
  seating_capacity      text,
  fuel_tank_capacity    text,
  
  -- Visuals & Metadata
  image_url             text,
  raw_data              jsonb,
  source                text        DEFAULT 'vehiclesdb',
  source_version        text,
  
  -- Timestamps
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- ── 2. ROW LEVEL SECURITY — VEHICLES ─────────────────────────

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Public storefront: anyone can read vehicles catalog
CREATE POLICY "Public can read vehicles"
  ON public.vehicles
  FOR SELECT
  USING (true);

-- Admin: authenticated users have full access
CREATE POLICY "Authenticated admin has full access to vehicles"
  ON public.vehicles
  FOR ALL
  USING      (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── 3. AUTO-UPDATE TIMESTAMPS TRIGGER ────────────────────────

CREATE TRIGGER vehicles_set_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ── 4. RELATE INVENTORY (CARS) TO VEHICLES CATALOGUE ────────

ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS vehicle_id text REFERENCES public.vehicles(id) ON DELETE SET NULL;

-- ── 5. INDEXES FOR PERFORMANCE ───────────────────────────────

CREATE INDEX IF NOT EXISTS vehicles_vehiclesdb_id_idx ON public.vehicles (vehiclesdb_id);
CREATE INDEX IF NOT EXISTS vehicles_make_idx ON public.vehicles (make);
CREATE INDEX IF NOT EXISTS vehicles_model_idx ON public.vehicles (model);
CREATE INDEX IF NOT EXISTS vehicles_year_idx ON public.vehicles (year);
CREATE INDEX IF NOT EXISTS vehicles_variant_idx ON public.vehicles (variant);
CREATE INDEX IF NOT EXISTS cars_vehicle_id_idx ON public.cars (vehicle_id);

-- ── 6. SEED AND UPDATE DEFAULT SHOWROOM STOCK REFERENCES ──────────

INSERT INTO public.vehicles (id, vehiclesdb_id, make, model) VALUES
  ('car/porsche/911', 'car/porsche/911', 'Porsche', '911'),
  ('car/lamborghini/huracan', 'car/lamborghini/huracan', 'Lamborghini', 'Huracan'),
  ('car/ferrari/488-pista', 'car/ferrari/488-pista', 'Ferrari', '488 Pista'),
  ('car/mercedes-benz/g-class', 'car/mercedes-benz/g-class', 'Mercedes-Benz', 'G-Class'),
  ('car/bentley/continental-gt', 'car/bentley/continental-gt', 'Bentley', 'Continental GT'),
  ('car/rolls-royce/ghost', 'car/rolls-royce/ghost', 'Rolls-Royce', 'Ghost'),
  ('car/land-rover/defender', 'car/land-rover/defender', 'Land Rover', 'Defender'),
  ('car/bmw/m5', 'car/bmw/m5', 'BMW', 'M5')
ON CONFLICT (id) DO NOTHING;

UPDATE public.cars SET vehicle_id = 'car/porsche/911' WHERE id = 'porsche-911-gt3rs-2023';
UPDATE public.cars SET vehicle_id = 'car/lamborghini/huracan' WHERE id = 'lamborghini-huracan-evo-v10';
UPDATE public.cars SET vehicle_id = 'car/ferrari/488-pista' WHERE id = 'ferrari-488-pista-v8';
UPDATE public.cars SET vehicle_id = 'car/mercedes-benz/g-class' WHERE id = 'mercedes-amg-g63-2023';
UPDATE public.cars SET vehicle_id = 'car/bentley/continental-gt' WHERE id = 'bentley-continental-gt-w12';
UPDATE public.cars SET vehicle_id = 'car/rolls-royce/ghost' WHERE id = 'rolls-royce-ghost-extended';
UPDATE public.cars SET vehicle_id = 'car/land-rover/defender' WHERE id = 'land-rover-defender-110-v8';
UPDATE public.cars SET vehicle_id = 'car/bmw/m5' WHERE id = 'bmw-m5-competition-v8';

