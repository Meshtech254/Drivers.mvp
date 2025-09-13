import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Home: React.FC = () => {
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*');

            if (error) {
                console.error('Error fetching profiles:', error);
            } else {
                setProfiles(data);
            }
        };

        fetchProfiles();
    }, []);

    return (
        <div>
            <h1>User Profiles</h1>
            <Link to="/profile/new">Create New Profile</Link>
            <div>
                {profiles.map(profile => (
                    <UserProfile key={profile.id} user={profile} onEdit={() => {/* handle edit */}} />
                ))}
            </div>
        </div>
    );
};

export default Home;