import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddPayments.css';
import { message } from "antd";
 
const AddPayment = ({ onClose, amount, requestId, request, username }) => {
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
        setPaymentData((prevData) => ({
          ...prevData,
          BankAccountNumber: response.data.bankAccountNumber,
          IFSC: response.data.ifsc,
        }));
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
 
      const toemail = localStorage.getItem("Payusername") || username; // Corrected
 
      const responseEmail = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_n4mw93i',
          template_id: 'template_hwohuhq',
          user_id: 'yKBDhfI1SwLvmocO0',
          template_params: {
            to_email: toemail,
            message: `Dear ${toemail},\n\nWe are pleased to inform you that your Payment successfully completed with Request ID ${requestId} of amount ${amount}.\n\nApproved Date: ${formattedDate}\nThank you for your prompt attention to this matter.`,
            'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...',
          },
        }),
      });
 
      if (!responseEmail.ok) {
        console.error('EmailJS request failed:', responseEmail.statusText);
        // Handle the error as needed
      } else {
        message.success('Email sent successfully!');
        // Handle success
      }
 
      localStorage.setItem('RequestId', response.data.RequestId);
      localStorage.setItem('PaymentId', response.data.PaymentId);
      localStorage.setItem('IFSC', response.data.IFSC); // storing IFSC in local storage
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
              readOnly
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
              readOnly
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
              readOnly
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