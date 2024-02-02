import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProfile.css';

const AddProfile = () => {
  const storedUsername = localStorage.getItem('username');

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    contactNumber: '',
    bankAccountNumber: '',
    ifsc: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (!profileData.firstName.trim()) {
      errors.firstName = 'Please enter your first name.';
    }

    if (!profileData.lastName.trim()) {
      errors.lastName = 'Please enter your last name.';
    }

    if (!profileData.city.trim()) {
      errors.city = 'Please enter your city.';
    }

    if (!profileData.contactNumber.trim()) {
      errors.contactNumber = 'Please enter your contact number.';
    } else if (!/^\d{10}$/.test(profileData.contactNumber.trim())) {
      errors.contactNumber = 'Contact Number must be 10 digits.';
    }
 
    if (!profileData.bankAccountNumber.trim()) {
      errors.bankAccountNumber = 'Please enter your bank account number.';
    } else if (!/^\d{15}$/.test(profileData.bankAccountNumber.trim())) {
      errors.bankAccountNumber = 'Bank Account Number must be 15 digits.';
    }
    if (!profileData.ifsc.trim()) {
      errors.ifsc = 'Please enter your ifsc code.';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill out the required fields correctly.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7007/api/UserProfile', profileData);

      console.log('Profile added successfully:', response.data);
      alert('Profile added successfully');
    } catch (error) {
      console.error('Error adding profile:', error.response?.data);
      alert('Failed to add profile. Please try again.');
    }
  };

  const handleCancel = () => {
    window.history.back();
    console.log('Operation canceled');
  };

  useEffect(() => {
    setProfileData((prevData) => ({
      ...prevData,
      username: storedUsername || '',
    }));
  }, [storedUsername]);

  return (
    <div className="addProfileContainer">
      <h2 className="addProfileHeader">Add Profile</h2>
      <div className="addProfileBox">
        <form className="addProfileForm" onSubmit={handleSubmit}>
          <div className="fieldContainer">
            <label className="fieldLabel" htmlFor="username">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
              className="form-control"
              readOnly
            />
          </div>

          <div className="fieldContainer">
            <label className="fieldLabel" htmlFor="firstName">
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>

          <div className="fieldContainer">
            <label className="fieldLabel" htmlFor="lastName">
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>

          <div className="fieldContainer">
            <label className="fieldLabel" htmlFor="city">
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={profileData.city}
              onChange={handleInputChange}
              className={`form-control ${errors.city ? 'is-invalid' : ''}`}
            />
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
          </div>

          <div className="fieldContainer">
            <label className="fieldLabel" htmlFor="contactNumber">
              Contact Number:
            </label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={profileData.contactNumber}
              onChange={handleInputChange}
              className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
            />
            {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
          </div>

          <div className="fieldContainer">
            <label className="fieldLabel" htmlFor="bankAccountNumber">
              Bank Account Number:
            </label>
            <input
              type="text"
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={profileData.bankAccountNumber}
              onChange={handleInputChange}
              className={`form-control ${errors.bankAccountNumber ? 'is-invalid' : ''}`}
            />
            {errors.bankAccountNumber && <div className="invalid-feedback">{errors.bankAccountNumber}</div>}
          </div>
          <div className="fieldContainer">
            <label className="fieldLabel" htmlFor="ifsc">
              IFSC:
            </label>
            <input
              type="text"
              id="ifsc"
              name="ifsc"
              value={profileData.ifsc}
              onChange={handleInputChange}
              className={`form-control ${errors.ifsc ? 'is-invalid' : ''}`}
            />
            {errors.ifsc && <div className="invalid-feedback">{errors.ifsc}</div>}
          </div>

          <div className="buttonContainer">
            <button type="submit" className="button btn-primary">
              Add Profile
            </button>
            <button type="button" onClick={handleCancel} className="button btn-danger">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;