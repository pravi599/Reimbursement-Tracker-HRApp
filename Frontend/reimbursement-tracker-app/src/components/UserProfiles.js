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
        // If deletion is successful, update the userProfiles state to reflect the changes
        setUserProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.username !== username));
      } catch (error) {
        console.error('Error deleting user profile:', error);
        // Handle error, e.g., show an error message
      }
    }
  };

  return (
    <div className="userProfilesContainer">
      <h2>User Profiles</h2>
      {error && <div className="error">{error}</div>}

      <table className="userProfilesTable">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Contact Number</th>
            <th>Bank Account Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userProfiles.map((profile) => (
            <tr key={profile.userId}>
              <td>{profile.userId}</td>
              <td>{profile.username}</td>
              <td>{profile.firstName}</td>
              <td>{profile.lastName}</td>
              <td>{profile.city}</td>
              <td>{profile.contactNumber}</td>
              <td>{profile.bankAccountNumber}</td>
              <td>
                <button onClick={() => handleDelete(profile.username)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserProfiles;
