export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  license_number?: string;
  license_type?: string;
  experience_years?: number;
  rating?: number;
  status?: 'available' | 'busy' | 'offline';
  location?: string;
  created_at?: string;
  updated_at?: string;
}