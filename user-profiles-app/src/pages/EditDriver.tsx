import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import DriverForm from '../components/DriverForm';
import { fetchDriverById, updateDriver } from '../services/supabaseClient';
import { Driver } from '../types';

const EditDriver: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDriver = async () => {
      try {
        setIsFetching(true);
        const data = await fetchDriverById(id);
        setDriver(data);
      } catch (err: any) {
        console.error('Error fetching driver:', err);
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      loadDriver();
    }
  }, [id]);

  const handleSubmit = async (driverData: Partial<Driver>) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateDriver(id, driverData);
      alert('Driver updated successfully!');
      history.push('/');
    } catch (err: any) {
      console.error('Error updating driver:', err);
      setError(err.message || 'Failed to update driver');
      alert('Error: ' + (err.message || 'Failed to update driver'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/');
  };

  if (isFetching) {
    return <div style={{ padding: '20px' }}>Loading driver...</div>;
  }

  if (error && !driver) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => history.push('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Edit Driver</h1>
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fee2e2', 
          color: '#991b1b', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      <DriverForm 
        driver={driver}
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditDriver;
