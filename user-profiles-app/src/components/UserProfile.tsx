import React from 'react';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  onEdit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  const renderUserDetails = () => {
    return (
      <div>
        <img src={user.avatar} alt={`${user.name}'s avatar`} />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
      </div>
    );
  };

  return (
    <div>
      {renderUserDetails()}
      <button onClick={onEdit}>Edit Profile</button>
    </div>
  );
};

export default UserProfile;