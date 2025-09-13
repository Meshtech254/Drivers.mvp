import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchUserProfiles = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*');
    if (error) throw new Error(error.message);
    return data;
};

export const fetchUserProfileById = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw new Error(error.message);
    return data;
};

export const updateUserProfile = async (id, updates) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);
    if (error) throw new Error(error.message);
    return data;
};

export default supabase;