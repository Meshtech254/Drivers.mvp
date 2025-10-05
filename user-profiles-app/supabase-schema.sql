-- Create drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    license_number TEXT,
    license_type TEXT,
    experience_years INTEGER,
    rating DECIMAL(3,2) DEFAULT 0.00,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_drivers_email ON public.drivers(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (adjust based on your security needs)
CREATE POLICY "Allow public read access" ON public.drivers
    FOR SELECT
    USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.drivers
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.drivers
    FOR UPDATE
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON public.drivers
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove if not needed)
INSERT INTO public.drivers (name, email, phone, license_number, license_type, experience_years, rating, status, location)
VALUES 
    ('John Doe', 'john.doe@example.com', '+254712345678', 'DL123456', 'Class A', 5, 4.5, 'available', 'Nairobi'),
    ('Jane Smith', 'jane.smith@example.com', '+254723456789', 'DL234567', 'Class B', 3, 4.8, 'available', 'Mombasa'),
    ('Mike Johnson', 'mike.johnson@example.com', '+254734567890', 'DL345678', 'Class A', 7, 4.2, 'busy', 'Kisumu')
ON CONFLICT (email) DO NOTHING;
