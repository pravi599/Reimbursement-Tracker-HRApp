import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfiles.css';

const UserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await axios.get('https://localhost:7007/api/UserProfile');
        setUserProfiles(response.data);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
        setError('Failed to fetch user profiles. Please try again.');
      }
    };

    fetchUserProfiles();
  }, []);

  const handleDelete = async (username) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the profile for ${username}?`);

    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7007/api/UserProfile/${username}`);
        setUserProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.username !== username));
      } catch (error) {
        console.error('Error deleting user profile:', error);
      }
    }
  };

  return (
    <div className="userProfilesContainer">
      <h2>User Profiles</h2>
      {error && <div className="error">{error}</div>}

      <div className="userProfilesList">
        {userProfiles.map((profile) => (
          <div className="userProfileCard" key={profile.userId}>
            <p><strong>User ID:</strong> {profile.userId}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>First Name:</strong> {profile.firstName}</p>
            <p><strong>Last Name:</strong> {profile.lastName}</p>
            <p><strong>City:</strong> {profile.city}</p>
            <p><strong>Contact Number:</strong> {profile.contactNumber}</p>
            <p><strong>Bank Account Number:</strong> {profile.bankAccountNumber}</p>
            <p><strong>IFSC:</strong> {profile.ifsc}</p>
            <button onClick={() => handleDelete(profile.username)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfiles;