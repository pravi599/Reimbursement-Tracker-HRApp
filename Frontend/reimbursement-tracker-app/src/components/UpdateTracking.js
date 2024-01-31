import React, { useState } from 'react';
import axios from 'axios';
import './Requests.css';
import { message } from "antd";
 
const UpdateTracking = ({ requestId, trackingDetails, onUpdateTracking, onClose, username }) => {
  const [trackingStatus, setTrackingStatus] = useState(trackingDetails.trackingStatus || '');
  const currentDate= new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}T${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
  const [approvalDate, setApprovalDate] = useState(formattedDate);
  const [reimbursementDate, setReimbursementDate] = useState(formattedDate);
 
 
  //console.log;
  const handleUpdate = async () => {
    const updatedTracking = {
      trackingId: trackingDetails.trackingId,
      requestId: requestId,
      trackingStatus: trackingStatus,
      approvalDate: formattedDate,
      reimbursementDate: formattedDate,
    };
    localStorage.setItem('Trackusername', username);
    const email = String(localStorage.getItem("Trackusername")) || username;
 
    const sendEmail = async () => {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
 
          },
          body: JSON.stringify({
 
            service_id: 'service_n4mw93i',
            template_id: 'template_ijlup9j',
            user_id: 'yKBDhfI1SwLvmocO0',
            template_params: {
              to_email: email,
              message: `Dear ${username},\n\nWe are pleased to inform you that your reimbursement request with Request ID ${requestId} has been ${trackingStatus.toLowerCase()}.\n\nApproval Date: ${approvalDate}\nReimbursement Date: ${reimbursementDate}\n\nThank you for your prompt attention to this matter.`,
              'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...',
            },
          }),
        });
 
 
        if (!response.ok) {
          console.error('EmailJS request failed:', response.statusText);
          // Handle the error as needed
        } else {
          message.success('Email sent successfully!');
          // Handle success
        }
      } catch (error) {
        message.error('Error sending email:', error);
        // Handle the error as needed
      }
    };
 
    try {
      // Make the API call to update the tracking status
      const response = await axios.put(`https://localhost:7007/api/Tracking`, updatedTracking);
 
      // Handle the response (log, show a message, etc.)
      console.log(response.data);
      alert('Tracking Status Updated Successfully');
      sendEmail();
 
      // Close the modal after updating
      onClose();
    } catch (error) {
      // Handle errors (log, show an error message, etc.)
      console.error('Error updating tracking:', error);
      alert('Failed to update tracking');
      console.log(error.response?.data);
    }
  };
 
  return (
    <div>
      <h2>Update Tracking</h2>
 
      <label>
        Tracking Status:
        <select
          name="trackingStatus"
          value={trackingStatus}
          onChange={(e) => setTrackingStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Rejected">Rejected</option>
          <option value="Approved">Approved</option>
          <option value="Verified">Verified</option>
        </select>
      </label>
 
      <label>
        Approval Date:
        <input
          type="datetime-local"
          name="approvalDate"
          value={approvalDate}
           onChange={(e) => setApprovalDate(e.target.value)}
          readOnly
        />
      </label>
 
      <label>
        Reimbursement Date:
        <input
          type="datetime-local"
          name="reimbursementDate"
          value={reimbursementDate}
          onChange={(e) => setReimbursementDate(e.target.value)}
          readOnly
        />
      </label>
 
      <div>
        <button onClick={handleUpdate}>Update Tracking</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
 
export default UpdateTracking;