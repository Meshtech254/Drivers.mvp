import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchDrivers = async () => {
    const { data, error } = await supabase
        .from('drivers')
        .select('*');
    if (error) {
        console.error('Error fetching drivers:', error);
        throw new Error(error.message);
    }
    return data;
};

export const fetchDriverById = async (id: string) => {
    const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        console.error('Error fetching driver:', error);
        throw new Error(error.message);
    }
    return data;
};

export const createDriver = async (driverData: any) => {
    const { data, error } = await supabase
        .from('drivers')
        .insert([driverData])
        .select()
        .single();
    if (error) {
        console.error('Error creating driver:', error);
        throw new Error(error.message);
    }
    return data;
};

export const updateDriver = async (id: string, updates: any) => {
    const { data, error } = await supabase
        .from('drivers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('Error updating driver:', error);
        throw new Error(error.message);
    }
    return data;
};

export const deleteDriver = async (id: string) => {
    const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Error deleting driver:', error);
        throw new Error(error.message);
    }
};

// Legacy profile functions (keep for backward compatibility)
export const fetchUserProfiles = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*');
    if (error) throw new Error(error.message);
    return data;
};

export const fetchUserProfileById = async (id: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw new Error(error.message);
    return data;
};

export const updateUserProfile = async (id: string, updates: any) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);
    if (error) throw new Error(error.message);
    return data;
};

export default supabase;