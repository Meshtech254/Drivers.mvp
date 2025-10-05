-- Enhanced Test Drivers with Reviews and Sample Bookings
-- Run this after creating the basic test drivers

-- First, get the IDs of our test drivers (store these for later use)
DO $$
DECLARE
  driver1_id uuid;
  driver2_id uuid;
  driver3_id uuid;
  driver4_id uuid;
  driver5_id uuid;
  employer_id uuid;
BEGIN
  -- Get driver IDs
  SELECT id INTO driver1_id FROM profiles WHERE email = 'john.kamau@test.com';
  SELECT id INTO driver2_id FROM profiles WHERE email = 'mary.wanjiku@test.com';
  SELECT id INTO driver3_id FROM profiles WHERE email = 'david.omondi@test.com';
  SELECT id INTO driver4_id FROM profiles WHERE email = 'grace.akinyi@test.com';
  SELECT id INTO driver5_id FROM profiles WHERE email = 'peter.mwangi@test.com';
  
  -- Create a test employer (or use an existing one)
  employer_id := gen_random_uuid();

  -- Insert sample reviews for each driver
  -- Reviews for John Kamau (5 stars)
  INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment, created_at)
  VALUES 
    (employer_id, driver1_id, 5, 'Excellent driver! Very professional and punctual. Highly recommended.', now() - interval '10 days'),
    (employer_id, driver1_id, 5, 'Great experience. John handled the truck with expertise.', now() - interval '5 days');

  -- Reviews for Mary Wanjiku (4 stars)
  INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment, created_at)
  VALUES 
    (employer_id, driver2_id, 4, 'Good driver, friendly and knows the routes well.', now() - interval '8 days'),
    (employer_id, driver2_id, 5, 'Very reliable and safe driver. Will hire again!', now() - interval '3 days');

  -- Reviews for David Omondi (4 stars)
  INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment, created_at)
  VALUES 
    (employer_id, driver3_id, 4, 'Decent driver, good for short trips.', now() - interval '12 days'),
    (employer_id, driver3_id, 4, 'Professional and courteous. Recommended.', now() - interval '6 days');

  -- Reviews for Grace Akinyi (5 stars)
  INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment, created_at)
  VALUES 
    (employer_id, driver4_id, 5, 'Outstanding! 10 years of experience really shows.', now() - interval '15 days'),
    (employer_id, driver4_id, 5, 'Best driver I have hired. Very experienced and careful.', now() - interval '7 days'),
    (employer_id, driver4_id, 5, 'Absolutely professional. Will definitely hire again.', now() - interval '2 days');

  -- Reviews for Peter Mwangi (5 stars)
  INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment, created_at)
  VALUES 
    (employer_id, driver5_id, 5, 'Expert truck driver. Handled heavy loads with ease.', now() - interval '20 days'),
    (employer_id, driver5_id, 4, 'Very experienced. Slight delay but overall good service.', now() - interval '9 days');

  -- Insert sample completed bookings
  INSERT INTO bookings (client_name, client_email, client_phone, driver_id, employer_id, message, status, created_at)
  VALUES
    ('James Mutua', 'james@example.com', '+254700111222', driver1_id, employer_id, 'Need truck driver for cargo delivery to Mombasa', 'completed', now() - interval '10 days'),
    ('Sarah Njeri', 'sarah@example.com', '+254700222333', driver2_id, employer_id, 'Airport pickup and drop off', 'completed', now() - interval '8 days'),
    ('Michael Otieno', 'michael@example.com', '+254700333444', driver3_id, employer_id, 'City tour and shopping assistance', 'completed', now() - interval '12 days'),
    ('Lucy Wambui', 'lucy@example.com', '+254700444555', driver4_id, employer_id, 'Daily commute for one week', 'completed', now() - interval '15 days'),
    ('Robert Kipchoge', 'robert@example.com', '+254700555666', driver5_id, employer_id, 'Long distance cargo transport', 'completed', now() - interval '20 days');

  -- Insert some pending bookings
  INSERT INTO bookings (client_name, client_email, client_phone, driver_id, employer_id, message, status, created_at)
  VALUES
    ('Alice Muthoni', 'alice@example.com', '+254700666777', driver1_id, employer_id, 'Need driver for weekend trip', 'pending', now() - interval '1 day'),
    ('Tom Odhiambo', 'tom@example.com', '+254700777888', driver2_id, employer_id, 'Wedding event transportation', 'pending', now() - interval '2 hours');

  RAISE NOTICE 'Test data created successfully!';
END $$;

-- View summary of test drivers with their ratings
SELECT 
  p.full_name,
  p.email,
  p.location,
  p.vehicle_type,
  p.rate,
  p.years_experience,
  p.is_available,
  COUNT(DISTINCT r.id) as review_count,
  ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
  COUNT(DISTINCT b.id) as total_bookings
FROM profiles p
LEFT JOIN reviews r ON p.id = r.reviewed_user_id
LEFT JOIN bookings b ON p.id = b.driver_id
WHERE p.email LIKE '%@test.com'
GROUP BY p.id, p.full_name, p.email, p.location, p.vehicle_type, p.rate, p.years_experience, p.is_available
ORDER BY avg_rating DESC, review_count DESC;
