-- Test Drivers Data
-- Run this in your Supabase SQL Editor to create 5 verified test drivers
-- Note: You'll need to create auth users first or use existing user IDs

-- First, let's create some test user accounts (you can skip this if you already have user IDs)
-- These are sample UUIDs - replace with actual user IDs from your auth.users table

-- Insert 5 verified test drivers
INSERT INTO profiles (
  id,
  email,
  full_name,
  phone,
  is_driver,
  is_approved,
  is_available,
  role,
  photo_url,
  location,
  availability,
  years_experience,
  rate,
  vehicle_type,
  license_type,
  kyc_status,
  kyc_dob,
  created_at
) VALUES
-- Driver 1: John Kamau - Experienced Truck Driver
(
  gen_random_uuid(),
  'john.kamau@test.com',
  'John Kamau',
  '+254712345001',
  true,
  true,
  true,
  'driver',
  'https://i.pravatar.cc/150?img=12',
  'Nairobi',
  'full-time',
  8,
  'Ksh 3,500/day',
  'truck',
  'BCE',
  'approved',
  '1988-03-15',
  now()
),

  -- Driver 2: Mary Wanjiku - Taxi Driver
  (
    driver2_id,
    'mary.wanjiku@test.com',
  'Mary Wanjiku',
  '+254712345002',
  true,
  true,
  true,
  'driver',
  'https://i.pravatar.cc/150?img=47',
  'Nairobi',
  'full-time',
  5,
  'Ksh 2,000/day',
  'taxi',
  'BCE',
  'approved',
  '1992-07-22',
  now()
),

-- Driver 3: David Omondi - Personal Car Driver
(
  gen_random_uuid(),
  'david.omondi@test.com',
  'David Omondi',
  '+254712345003',
  true,
  true,
  true,
  'driver',
  'https://i.pravatar.cc/150?img=33',
  'Mombasa',
  'part-time',
  3,
  'Ksh 1,800/day',
  'personal car',
  'BCE',
  'approved',
  '1995-11-08',
  now()
),

  -- Driver 4: Grace Akinyi - Experienced Taxi Driver
  (
    driver4_id,
    'grace.akinyi@test.com',
  'Grace Akinyi',
  '+254712345004',
  true,
  true,
  true,
  'driver',
  'https://i.pravatar.cc/150?img=45',
  'Kisumu',
  'full-time',
  10,
  'Ksh 2,500/day',
  'taxi',
  'BCE',
  'approved',
  '1985-05-30',
  now()
),

  -- Driver 5: Peter Mwangi - Truck Driver
  (
    driver5_id,
    'peter.mwangi@test.com',
  'Peter Mwangi',
  '+254712345005',
  true,
  true,
  false,
  'driver',
  'https://i.pravatar.cc/150?img=51',
  'Nakuru',
  'full-time',
  12,
  'Ksh 4,000/day',
  'truck',
  'BCE',
  'approved',
  '1982-09-18',
  now()
  );

  RAISE NOTICE 'Test drivers created successfully!';
  RAISE NOTICE 'Login credentials: email@test.com / TestPass123!';
END $$;

-- Verify the inserted drivers
SELECT 
  full_name,
  email,
  location,
  vehicle_type,
  rate,
  years_experience,
  is_available,
  kyc_status
FROM profiles
WHERE email LIKE '%@test.com'
ORDER BY created_at DESC;
