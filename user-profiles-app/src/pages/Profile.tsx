import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDriverById, updateDriver } from '../services/supabaseClient';
import UserProfile from '../components/UserProfile';
import { Driver } from '../types';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [driver, setDriver] = useState<Driver | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDriver = async () => {
            try {
                setLoading(true);
                const data = await fetchDriverById(id);
                setDriver(data);
            } catch (err: any) {
                console.error('Error fetching driver:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadDriver();
        }
    }, [id]);

    const handleEdit = async (updatedDriver: any) => {
        try {
            await updateDriver(id, updatedDriver);
            setDriver(updatedDriver);
        } catch (err: any) {
            console.error('Error updating driver:', err);
            alert('Failed to update driver: ' + err.message);
        }
    };

    if (loading) {
        return <div>Loading driver profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!driver) {
        return <div>Driver not found</div>;
    }

    return (
        <div>
            <h1>Driver Profile</h1>
            <UserProfile user={driver} onEdit={handleEdit} />
        </div>
    );
};

export default Profile;