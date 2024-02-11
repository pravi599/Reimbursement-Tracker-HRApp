// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const userRole = localStorage.getItem('role'); // Retrieve the user's role from local storage

  const handleEasyTrackingClick = () => {
    if (userRole === 'Employee') {
      window.location.href = '/Tracking'; // Redirect by changing the window location
    } else if (userRole === 'HR') {
      window.location.href = '/Requests'; // Redirect HR to the same route as Employee for illustration
    }
  };

  const handleQuickSubmissionClick = () => {
    if (userRole === 'Employee') {
      window.location.href = '/Add-Request'; // Redirect by changing the window location
    } else if (userRole === 'HR') {
      window.location.href = '/Requests'; // Redirect by changing the window location
    }
  };

  return (
    <div className="home-container">
      <header>
        <h1>Welcome to Reimbursement Tracker</h1>
        <p>Efficiently manage and track employee reimbursements with our app.</p>
      </header>

      <section className="features">
        <div className="feature" onClick={handleEasyTrackingClick}>
          <Link to="/Tracking">
            <div>
              <h2>Easy Tracking</h2>
              <p>Effortlessly track and manage employee reimbursements in one place.</p>
            </div>
          </Link>
        </div>

        <div className="feature" onClick={handleQuickSubmissionClick}>
          <Link to="/requests">
            <div>
              <h2>Quick Submission</h2>
              <p>Submit reimbursement requests with just a few clicks.</p>
            </div>
          </Link>
        </div>

        <div className="feature">
          <h2>Transparent Process</h2>
          <p>Keep the reimbursement process transparent with real-time updates.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;