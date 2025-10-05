import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import DriverForm from '../components/DriverForm';
import { createDriver } from '../services/supabaseClient';
import { Driver } from '../types';

const CreateDriver: React.FC = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (driverData: Partial<Driver>) => {
    try {
      setIsLoading(true);
      setError(null);
      await createDriver(driverData);
      alert('Driver created successfully!');
      history.push('/');
    } catch (err: any) {
      console.error('Error creating driver:', err);
      setError(err.message || 'Failed to create driver');
      alert('Error: ' + (err.message || 'Failed to create driver'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add New Driver</h1>
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
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CreateDriver;
