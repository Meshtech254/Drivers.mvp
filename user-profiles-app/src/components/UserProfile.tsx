import React from 'react';
import { Driver } from '../types';

interface UserProfileProps {
  user: Driver;
  onEdit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  const renderUserDetails = () => {
    return (
      <div>
        {user.avatar && (
          <img 
            src={user.avatar} 
            alt={`${user.name}'s avatar`}
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              marginBottom: '10px'
            }}
          />
        )}
        <h2 style={{ margin: '10px 0' }}>{user.name}</h2>
        <p style={{ margin: '5px 0', color: '#6b7280' }}>
          <strong>Email:</strong> {user.email}
        </p>
        {user.phone && (
          <p style={{ margin: '5px 0', color: '#6b7280' }}>
            <strong>Phone:</strong> {user.phone}
          </p>
        )}
        {user.license_number && (
          <p style={{ margin: '5px 0', color: '#6b7280' }}>
            <strong>License:</strong> {user.license_number} ({user.license_type})
          </p>
        )}
        {user.experience_years !== undefined && (
          <p style={{ margin: '5px 0', color: '#6b7280' }}>
            <strong>Experience:</strong> {user.experience_years} years
          </p>
        )}
        {user.rating !== undefined && user.rating > 0 && (
          <p style={{ margin: '5px 0', color: '#6b7280' }}>
            <strong>Rating:</strong> ⭐ {user.rating.toFixed(1)}
          </p>
        )}
        {user.status && (
          <p style={{ margin: '5px 0' }}>
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: user.status === 'available' ? '#d1fae5' : user.status === 'busy' ? '#fee2e2' : '#e5e7eb',
              color: user.status === 'available' ? '#065f46' : user.status === 'busy' ? '#991b1b' : '#374151'
            }}>
              {user.status.toUpperCase()}
            </span>
          </p>
        )}
        {user.location && (
          <p style={{ margin: '5px 0', color: '#6b7280' }}>
            <strong>Location:</strong> {user.location}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      {renderUserDetails()}
    </div>
  );
};

export default UserProfile;