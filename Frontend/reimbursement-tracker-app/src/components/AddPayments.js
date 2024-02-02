import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddPayments.css';

const AddPayment = ({ onClose, amount, requestId, request }) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}T${currentDate
    .getHours()
    .toString()
    .padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

  const [paymentData, setPaymentData] = useState({
    RequestId: requestId,
    BankAccountNumber: '',
    IFSC: '',
    PaymentAmount: amount,
    PaymentDate: formattedDate,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchBankAccountNumber = async () => {
      try {
        const response = await axios.get(`https://localhost:7007/api/UserProfile/username/${request.username}`);
        setPaymentData((prevData) => ({ ...prevData, BankAccountNumber: response.data.bankAccountNumber }));
      } catch (error) {
        console.error('Error fetching bank account number:', error);
        // Handle the error as needed
      }
    };

    if (request) {
      fetchBankAccountNumber();
    }
  }, [request]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.BankAccountNumber.trim()) {
      newErrors.BankAccountNumber = 'Please enter a BankAccountNumber Number.';
    }

    if (!paymentData.IFSC.trim()) {
      newErrors.IFSC = 'Please enter a valid IFSC.';
    }

    if (!paymentData.PaymentAmount || paymentData.PaymentAmount <= 0) {
      newErrors.PaymentAmount = 'Please enter a valid Payment Amount.';
    }

    if (!paymentData.PaymentDate.trim()) {
      newErrors.PaymentDate = 'Please enter a valid Payment Date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill out the required fields correctly.');
      return;
    }

    try {
      const response = await axios.post(
        'https://localhost:7007/api/PaymentDetails',
        paymentData
      );

      console.log('Payment added successfully:', response.data);
      alert('Payment added successfully');

      localStorage.setItem('RequestId', response.data.RequestId);
      localStorage.setItem('PaymentId', response.data.PaymentId);
      onClose();
    } catch (error) {
      console.error('Error adding payment:', error.response?.data);
      alert('Failed to add payment. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h2 className='heading'>Add Payment</h2>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='RequestId'>RequestId:</label>
            <input
              type='text'
              id='RequestId'
              name='RequestId'
              value={paymentData.RequestId}
              readOnly
            />
          </div>

          <div>
            <label htmlFor='BankAccountNumber'>BankAccount Number:</label>
            <input
              type='text'
              id='BankAccountNumber'
              name='BankAccountNumber'
              value={paymentData.BankAccountNumber}
              onChange={handleInputChange}
            />
            {errors.BankAccountNumber && (
              <div className='error'>{errors.BankAccountNumber}</div>
            )}
          </div>

          <div>
            <label htmlFor='IFSC'>IFSC:</label>
            <input
              type='text'
              id='IFSC'
              name='IFSC'
              value={paymentData.IFSC}
              onChange={handleInputChange}
            />
            {errors.IFSC && <div className='error'>{errors.IFSC}</div>}
          </div>

          <div>
            <label htmlFor='PaymentAmount'>Payment Amount:</label>
            <input
              type='number'
              id='PaymentAmount'
              name='PaymentAmount'
              value={paymentData.PaymentAmount}
              onChange={handleInputChange}
            />
            {errors.PaymentAmount && (
              <div className='error'>{errors.PaymentAmount}</div>
            )}
          </div>

          <div>
            <label htmlFor='PaymentDate'>Payment Date:</label>
            <input
              type='datetime-local'
              id='PaymentDate'
              name='PaymentDate'
              value={paymentData.PaymentDate}
              onChange={handleInputChange}
              readOnly
            />
            {errors.PaymentDate && <div className='error'>{errors.PaymentDate}</div>}
          </div>

          <button type='submit'>Add Payment</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;
