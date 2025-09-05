import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  // create a demo driver profile (id must match an auth.users id in your Supabase project for full relation)
  const demo = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'driver@example.com',
    full_name: 'Demo Driver',
    is_driver: true,
    is_approved: true,
    role: 'driver',
    location: 'Nairobi',
    availability: 'full-time',
    is_available: true,
    years_experience: 5,
    rate: 'Ksh 2,000/day',
    vehicle_type: 'truck',
    license_type: 'CE'
  }
  const { data, error } = await supabaseAdmin.from('profiles').upsert(demo)
  if (error) return res.status(500).json({ error })
  res.json({ data })
}
