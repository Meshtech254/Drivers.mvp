-- Supabase schema for Drivers.com MVP (booking + profiles)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  is_driver boolean default false,
  is_approved boolean default false,
  years_experience int,
  rate text,
  vehicle_types text,
  license_file_path text,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text,
  client_email text,
  client_phone text,
  driver_id uuid references profiles(id),
  message text,
  status text default 'requested',
  created_at timestamptz default now()
);
