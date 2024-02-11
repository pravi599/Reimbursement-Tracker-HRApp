import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GetPayments.css';

const GetPayments = () => {
  // State variables
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch payment details
  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // API request to get payment details
      const response = await axios.get('https://localhost:7007/api/PaymentDetails');
      console.log('Response:', response.data);

      // Check if the response has a 'data' property
      if (response && response.data) {
        setPaymentData(response.data);
      } else {
        setError('Invalid response format');
      }
    } catch (error) {
      // Handle errors during the API request
      console.error('Error fetching payment details:', error.response ? error.response.data : error.message);
      setError('Failed to fetch payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch payments automatically when the component mounts
  useEffect(() => {
    fetchPaymentDetails();
  }, []); // The empty dependency array ensures this effect runs once when the component mounts

  // JSX for rendering the component
  return (
    <div>
      <h2>Payment Details</h2>

      {loading && <p>Loading payment details...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="payment-tiles">
        {paymentData.map((payment) => (
          <div key={payment.paymentId} className="payment-tile">
            <h3>Payment ID: {payment.paymentId}</h3>
            <p>Request ID: {payment.requestId}</p>
            <p>Bank Account Number: {payment.bankAccountNumber}</p>
            <p>IFSC: {payment.ifsc}</p>
            <p>Payment Amount: {payment.paymentAmount}</p>
            <p>Payment Date: {payment.paymentDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetPayments;