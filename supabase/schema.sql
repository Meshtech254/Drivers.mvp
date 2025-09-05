-- Supabase schema for Drivers.com MVP (booking + profiles)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  is_driver boolean default false,
  is_approved boolean default false,
  role text, -- 'driver' or 'employer'
  photo_url text,
  location text,
  availability text, -- 'part-time' | 'full-time'
  is_available boolean default true,
  years_experience int,
  rate text,
  vehicle_type text,
  license_type text,
  license_file_path text,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text,
  client_email text,
  client_phone text,
  driver_id uuid references profiles(id),
  employer_id uuid references auth.users(id),
  message text,
  status text default 'requested',
  created_at timestamptz default now()
);

-- Optional: favorites for employers
create table if not exists favorites (
  employer_id uuid references auth.users(id),
  driver_id uuid references profiles(id),
  created_at timestamptz default now(),
  primary key (employer_id, driver_id)
);
