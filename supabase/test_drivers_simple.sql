-- Simple Test Drivers Script (No Auth Users Required)
-- This temporarily disables the foreign key constraint

-- Step 1: Drop the foreign key constraint temporarily
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 2: Insert 5 verified test drivers
INSERT INTO profiles (
  id, email, full_name, phone, is_driver, is_approved, is_available,
  role, photo_url, location, availability, years_experience, rate,
  vehicle_type, license_type, kyc_status, kyc_dob, created_at
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
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
  DATE '1988-03-15',
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
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
  DATE '1992-07-22',
  now()
),
(
  '33333333-3333-3333-3333-333333333333',
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
  DATE '1995-11-08',
  now()
),
(
  '44444444-4444-4444-4444-444444444444',
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
  DATE '1985-05-30',
  now()
),
(
  '55555555-5555-5555-5555-555555555555',
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
  DATE '1982-09-18',
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Re-add the foreign key constraint (optional - only if you need it)
-- ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
--   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

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
