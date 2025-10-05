import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import { fetchDrivers } from '../services/supabaseClient';
import { Driver } from '../types';

const Home: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDrivers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchDrivers();
                setDrivers(data || []);
            } catch (err: any) {
                console.error('Error loading drivers:', err);
                setError(err.message || 'Failed to load drivers');
            } finally {
                setLoading(false);
            }
        };

        loadDrivers();
    }, []);

    if (loading) {
        return <div>Loading drivers...</div>;
    }

    if (error) {
        return (
            <div>
                <h1>Error Loading Drivers</h1>
                <p style={{ color: 'red' }}>{error}</p>
                <p>Please check:</p>
                <ul>
                    <li>Your Supabase credentials are set in .env file</li>
                    <li>The 'drivers' table exists in your Supabase database</li>
                    <li>Row Level Security (RLS) policies allow reading</li>
                </ul>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Available Drivers</h1>
                <Link 
                    to="/driver/new"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Add New Driver
                </Link>
            </div>
            <div>
                {drivers.length === 0 ? (
                    <p>No drivers found. Add your first driver!</p>
                ) : (
                    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {drivers.map(driver => (
                            <div key={driver.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                                <UserProfile 
                                    user={driver} 
                                    onEdit={() => {/* handle edit */}} 
                                />
                                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                    <Link 
                                        to={`/driver/edit/${driver.id}`}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '5px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Edit
                                    </Link>
                                    <Link 
                                        to={`/profile/${driver.id}`}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '5px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;