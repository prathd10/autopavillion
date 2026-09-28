-- SQL script to space out G-Wagon, Porsche Cayenne, and Bentley Continental GT in the inventory
-- Order:
-- 1. Mercedes-AMG G 63 (first among the three)
-- 2. 4 cars interval
-- 3. Porsche Cayenne
-- 4. 5 cars interval
-- 5. Bentley Continental GT

UPDATE cars
SET created_at = '2026-09-10T18:00:00.000000+00:00'
WHERE id = 'rehan-shafiq-1789025472735'; -- 2020 Mercedes-AMG G 63

UPDATE cars
SET created_at = '2026-08-18T18:15:00.000000+00:00'
WHERE id = '2020-porsche-cayenne-white-premium-performance-luxury-suv-1789060948513'; -- 2020 Porsche Cayenne

UPDATE cars
SET created_at = '2026-08-18T18:10:15.000000+00:00'
WHERE id = 'bentley-continental-gt-1788241705488'; -- Bentley Continental GT
