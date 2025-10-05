import React, { useState, useEffect } from 'react';
import { Driver } from '../types';

interface DriverFormProps {
  driver?: Driver | null;
  onSubmit: (driverData: Partial<Driver>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DriverForm: React.FC<DriverFormProps> = ({ driver, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<Partial<Driver>>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    license_number: '',
    license_type: 'Class B',
    experience_years: 0,
    rating: 0,
    status: 'available',
    location: '',
  });

  useEffect(() => {
    if (driver) {
      setFormData(driver);
    }
  }, [driver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience_years' || name === 'rating' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>{driver ? 'Edit Driver' : 'Add New Driver'}</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          placeholder="+254712345678"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="avatar">Avatar URL</label>
        <input
          type="url"
          id="avatar"
          name="avatar"
          value={formData.avatar || ''}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="license_number">License Number</label>
        <input
          type="text"
          id="license_number"
          name="license_number"
          value={formData.license_number || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="license_type">License Type</label>
        <select
          id="license_type"
          name="license_type"
          value={formData.license_type || 'Class B'}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="Class A">Class A</option>
          <option value="Class B">Class B</option>
          <option value="Class C">Class C</option>
          <option value="Class D">Class D</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="experience_years">Experience (Years)</label>
        <input
          type="number"
          id="experience_years"
          name="experience_years"
          value={formData.experience_years || 0}
          onChange={handleChange}
          min="0"
          max="50"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="rating">Rating (0-5)</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={formData.rating || 0}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status || 'available'}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="Nairobi, Kenya"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Saving...' : (driver ? 'Update Driver' : 'Create Driver')}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6b7280', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DriverForm;
