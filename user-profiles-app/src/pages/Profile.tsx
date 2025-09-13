import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import UserProfile from '../components/UserProfile';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
            } else {
                setUser(data);
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [id]);

    const handleEdit = async (updatedUser: any) => {
        const { error } = await supabase
            .from('profiles')
            .update(updatedUser)
            .eq('id', id);

        if (error) {
            console.error('Error updating user profile:', error);
        } else {
            setUser(updatedUser);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <UserProfile user={user} onEdit={handleEdit} />
        </div>
    );
};

export default Profile;