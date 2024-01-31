

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddRequest.css'; // Import the CSS file
 
const AddRequest = () => {
  const currentDate= new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}T${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
 
  const initialState = {
    expenseCategory: 'Select Category',
    amount: 0,
    document: null,
    description: '',
    requestDate: formattedDate,
    customExpenseCategory: '',
    agreeToPolicies: false,
    showPolicies: false,
  };
  const [requestData, setRequestData] = useState({ ...initialState });
  const [errors, setErrors] = useState({});
 
  useEffect(() => {
    const username = localStorage.getItem('username');
    setRequestData((prevRequestData) => ({ ...prevRequestData, username }));
  }, []);
 
  const handleInputChange = (e) => {
    const { name, type, checked } = e.target;
    if (type === 'file') {
      const fileInput = e.target;
      const file = fileInput.files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (file && allowedTypes.includes(file.type)) {
        setRequestData({ ...requestData, [name]: file });
      } else {
        // Reset file input if an invalid file type is selected
        fileInput.value = '';
        alert('Please upload a valid document (PDF, PNG, JPEG, DOC, DOCX).');
      }
    } else {
      setRequestData({ ...requestData, [name]: type === 'checkbox' ? checked : e.target.value });
    }
   };
 
  const validateForm = () => {
    const errors = {};
 
    if (!requestData.expenseCategory || requestData.expenseCategory === 'Select Category') {
      errors.expenseCategory = 'Please select an expense category.';
    }
 
    if (!requestData.amount || isNaN(requestData.amount) || requestData.amount <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0.';
    }
 
    if (!requestData.document) {
      errors.document = 'Please upload a document.';
    }
 
    if (!requestData.description.trim()) {
      errors.description = 'Please enter a description.';
    }
 
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!requestData.agreeToPolicies) {
      alert('Please agree to the reimbursement policies before submitting.');
      return;
    }
 
    if (!validateForm()) {
      alert('Please fill out the required fields correctly.');
      return;
    }
 
    const categoryToSubmit = requestData.customExpenseCategory || requestData.expenseCategory;
 
    try {
      const formData = new FormData();
      formData.append('expenseCategory', categoryToSubmit);
      formData.append('amount', requestData.amount);
      formData.append('document', requestData.document);
      formData.append('description', requestData.description);
      formData.append('requestDate', requestData.requestDate);
      formData.append('username', requestData.username);
 
      const response = await axios.post('https://localhost:7007/api/Request', formData);
 
      console.log('Request added successfully:', response.data);
      alert('Request added successfully');
      setRequestData({ ...initialState });
    } catch (error) {
      console.error('Error adding request:', error.response?.data);
      alert('Failed to add Request. Please try again.');
    }
  };
 
  const handleCancel = () => {
    window.history.back();
    console.log('Operation canceled');
  };
 
  const handleViewPolicies = () => {
    setRequestData({ ...requestData, showPolicies: true });
  };
 
  return (
    <div className="addRequestContainer">
      <h2>Add Request</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Expense Category:
          <select name="expenseCategory" value={requestData.expenseCategory} onChange={handleInputChange}>
            <option value="">Select Category</option>
            <option value="Travel">Travel</option>
            <option value="Meals">Meals</option>
            <option value="Supplies">Supplies</option>
            <option value="Training">Training</option>
            <option value="Health">Health</option>
            <option value="other">Other</option>
          </select>
        </label>
        {requestData.expenseCategory === 'other' && (
          <label>
            Custom Expense Category:
            <input
              type="text"
              name="customExpenseCategory"
              value={requestData.customExpenseCategory}
              onChange={handleInputChange}
            />
          </label>
        )}
        {errors.expenseCategory && <div className="error">{errors.expenseCategory}</div>}
 
        <label>
          Amount:
          <input type="number" name="amount" value={requestData.amount} onChange={handleInputChange} />
        </label>
        {errors.amount && <div className="error">{errors.amount}</div>}
 
        <label>
          Document:
          <input type="file" name="document" onChange={handleInputChange} />
        </label>
        {errors.document && <div className="error">{errors.document}</div>}
 
        <label>
          Description:
          <textarea name="description" value={requestData.description} onChange={handleInputChange} />
        </label>
        {errors.description && <div className="error">{errors.description}</div>}
 
        <label>
          Request Date:
          <input type="datetime-local" name="requestDate" value={requestData.requestDate} onChange={handleInputChange} readOnly />
        </label>
 
        <div className="policies">
          <h3>Policy Compliance:</h3>
          {requestData.showPolicies && (
            <ul>
              <li>Expense Categories: Clearly specify the category of your expense from the provided options (e.g., Travel, Meals, Supplies, Training, Health, Other).</li>
              <li>Documentation: Attach all relevant receipts and documents supporting your expenses. Ensure they are clear, legible, and itemized.</li>
              <li>Amount Limits: Adhere to the specified limits for each expense category. Any request exceeding the limit may require additional justification.</li>
              <li>Custom Expense Category: If your expense doesn't fit into the predefined categories, select "Other" and provide details in the custom expense category field.</li>
              <li>Currency: Clearly indicate the currency used for your expenses.</li>
              <li>Policy Compliance: Ensure your reimbursement request complies with company policies and guidelines. Check for any policy violations before submitting the request.</li>
              <li>Description: Provide a detailed description of each expense, explaining its necessity and relevance to company activities.</li>
              <li>Request Date: Specify the date of the reimbursement request.</li>
              <li>Approval Process: Reimbursement requests will undergo an approval process. Ensure all information is accurate to avoid delays.</li>
              <li>Agreement: By submitting a reimbursement request, you confirm that the provided information is accurate and complies with company policies.</li>
              <li>Policy Updates: Stay informed about any updates or changes to the reimbursement policies.</li>
              <li>These policies aim to ensure transparency, accuracy, and compliance with company guidelines when submitting reimbursement requests for expenses. Adjust them according to your organization's specific needs and policies.</li>
              {/* Add other policy points ... */}
            </ul>
          )}
          <button type="button" onClick={handleViewPolicies} className="viewPoliciesButton">
            Click to View Policies
          </button>
        </div>
 
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="agreeToPolicies"
            checked={requestData.agreeToPolicies}
            onChange={handleInputChange}
          />
          <p className='para'> I agree to the reimbursement policies </p>
        </label>
 
        <div>
          <button type="submit">Add Request</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};
 
export default AddRequest;
 