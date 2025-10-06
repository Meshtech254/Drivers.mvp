-- Add Reviews and Bookings to Test Drivers
-- Run this AFTER running test_drivers_simple.sql

-- Insert sample reviews for each driver
-- Reviews for John Kamau (5 stars)
INSERT INTO reviews (id, reviewer_id, reviewed_user_id, rating, comment, created_at)
VALUES 
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 5, 'Excellent driver! Very professional and punctual. Highly recommended.', now() - interval '10 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 5, 'Great experience. John handled the truck with expertise.', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Reviews for Mary Wanjiku (4 stars)
INSERT INTO reviews (id, reviewer_id, reviewed_user_id, rating, comment, created_at)
VALUES 
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 4, 'Good driver, friendly and knows the routes well.', now() - interval '8 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 5, 'Very reliable and safe driver. Will hire again!', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- Reviews for David Omondi (4 stars)
INSERT INTO reviews (id, reviewer_id, reviewed_user_id, rating, comment, created_at)
VALUES 
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 4, 'Decent driver, good for short trips.', now() - interval '12 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 4, 'Professional and courteous. Recommended.', now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- Reviews for Grace Akinyi (5 stars)
INSERT INTO reviews (id, reviewer_id, reviewed_user_id, rating, comment, created_at)
VALUES 
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 5, 'Outstanding! 10 years of experience really shows.', now() - interval '15 days'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 5, 'Best driver I have hired. Very experienced and careful.', now() - interval '7 days'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 5, 'Absolutely professional. Will definitely hire again.', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- Reviews for Peter Mwangi (5 stars)
INSERT INTO reviews (id, reviewer_id, reviewed_user_id, rating, comment, created_at)
VALUES 
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 5, 'Expert truck driver. Handled heavy loads with ease.', now() - interval '20 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 4, 'Very experienced. Slight delay but overall good service.', now() - interval '9 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample completed bookings
INSERT INTO bookings (id, client_name, client_email, client_phone, driver_id, employer_id, message, status, created_at)
VALUES
  (gen_random_uuid(), 'James Mutua', 'james@example.com', '+254700111222', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Need truck driver for cargo delivery to Mombasa', 'completed', now() - interval '10 days'),
  (gen_random_uuid(), 'Sarah Njeri', 'sarah@example.com', '+254700222333', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Airport pickup and drop off', 'completed', now() - interval '8 days'),
  (gen_random_uuid(), 'Michael Otieno', 'michael@example.com', '+254700333444', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'City tour and shopping assistance', 'completed', now() - interval '12 days'),
  (gen_random_uuid(), 'Lucy Wambui', 'lucy@example.com', '+254700444555', '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Daily commute for one week', 'completed', now() - interval '15 days'),
  (gen_random_uuid(), 'Robert Kipchoge', 'robert@example.com', '+254700555666', '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Long distance cargo transport', 'completed', now() - interval '20 days')
ON CONFLICT (id) DO NOTHING;

-- Insert some pending bookings
INSERT INTO bookings (id, client_name, client_email, client_phone, driver_id, employer_id, message, status, created_at)
VALUES
  (gen_random_uuid(), 'Alice Muthoni', 'alice@example.com', '+254700666777', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Need driver for weekend trip', 'pending', now() - interval '1 day'),
  (gen_random_uuid(), 'Tom Odhiambo', 'tom@example.com', '+254700777888', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Wedding event transportation', 'pending', now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

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
