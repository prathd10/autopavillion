-- SQL script to space out BMW Z4, Mercedes-AMG G 63, Lamborghini Urus, Porsche Cayenne, and Bentley Continental GT in the sold inventory
-- Order:
-- 1. 2019 BMW Z4 (created_at: 2026-09-30T14:06:05.038219+00:00)
-- 2. 5 cars interval
-- 3. 2020 Mercedes-AMG G 63
-- 4. 5 cars interval
-- 5. 2020 Lamborghini Urus
-- 6. 5 cars interval
-- 7. 2020 Porsche Cayenne
-- 8. 5 cars interval
-- 9. Bentley Continental GT

-- 1. 2020 Mercedes-AMG G 63 (after 5 cars from BMW Z4)
UPDATE cars
SET created_at = '2026-08-18T18:14:00.000000+00:00'
WHERE id = 'rehan-shafiq-1789025472735';

-- 2. 2020 Lamborghini Urus (after 5 cars from Mercedes-AMG G 63)
UPDATE cars
SET created_at = '2026-08-18T18:09:20.000000+00:00'
WHERE id = '2020-lamborghini-urus-luxury-performance-suv-italian-super-suv-1790773548844';

-- 3. 2020 Porsche Cayenne (after 5 cars from Lamborghini Urus)
UPDATE cars
SET created_at = '2026-08-18T18:05:00.000000+00:00'
WHERE id = '2020-porsche-cayenne-white-premium-performance-luxury-suv-1789060948513';

-- 4. Bentley Continental GT (after 5 cars from Porsche Cayenne)
UPDATE cars
SET created_at = '2026-08-18T17:59:00.000000+00:00'
WHERE id = 'bentley-continental-gt-1788241705488';

