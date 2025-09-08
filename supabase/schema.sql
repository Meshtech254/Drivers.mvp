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
  kyc_status text,
  kyc_id_document_url text,
  kyc_selfie_url text,
  kyc_dob date,
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

-- Reports table
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  reported_user_id uuid references profiles(id) on delete set null,
  reason text not null,
  details text,
  created_at timestamptz default now()
);

-- Reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewed_user_id uuid references profiles(id) on delete set null,
  booking_id uuid references bookings(id) on delete set null,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Enable RLS and policies
alter table if exists reports enable row level security;
alter table if exists reviews enable row level security;

-- Reports: insert by authenticated; select by admin only (role flag)
do $$ begin
  perform 1 from pg_policies where tablename = 'reports' and policyname = 'reports_insert_any_auth';
  if not found then
    create policy reports_insert_any_auth on reports for insert to authenticated with check (true);
  end if;
end $$;

do $$ begin
  perform 1 from pg_policies where tablename = 'reports' and policyname = 'reports_select_admin';
  if not found then
    create policy reports_select_admin on reports for select to authenticated using (exists (select 1 from profiles p where p.id = auth.uid() and (p.is_admin = true or p.role = 'admin')));
  end if;
end $$;

-- Reviews: insert by authenticated; select public (for profile display)
do $$ begin
  perform 1 from pg_policies where tablename = 'reviews' and policyname = 'reviews_insert_any_auth';
  if not found then
    create policy reviews_insert_any_auth on reviews for insert to authenticated with check (true);
  end if;
end $$;

do $$ begin
  perform 1 from pg_policies where tablename = 'reviews' and policyname = 'reviews_select_public';
  if not found then
    create policy reviews_select_public on reviews for select to public using (true);
  end if;
end $$;
-- Enable RLS and policies for profiles and bookings
alter table if exists profiles enable row level security;
alter table if exists bookings enable row level security;

-- Profiles: user can read/update own row
do $$ begin
  perform 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_select_own';
  if not found then
    create policy profiles_select_own on profiles for select to authenticated using (id = auth.uid());
  end if;
end $$;

do $$ begin
  perform 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_update_own';
  if not found then
    create policy profiles_update_own on profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
  end if;
end $$;

-- Optional: allow insert by authenticated for own id (service role bypasses RLS anyway)
do $$ begin
  perform 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_insert_own';
  if not found then
    create policy profiles_insert_own on profiles for insert to authenticated with check (id = auth.uid());
  end if;
end $$;

-- Bookings: driver or employer can read their own related bookings
do $$ begin
  perform 1 from pg_policies where tablename = 'bookings' and policyname = 'bookings_select_related';
  if not found then
    create policy bookings_select_related on bookings for select to authenticated using (driver_id = auth.uid() or employer_id = auth.uid());
  end if;
end $$;

-- Bookings: allow insert by authenticated users
do $$ begin
  perform 1 from pg_policies where tablename = 'bookings' and policyname = 'bookings_insert_any_auth';
  if not found then
    create policy bookings_insert_any_auth on bookings for insert to authenticated with check (true);
  end if;
end $$;
