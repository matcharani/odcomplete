import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './dashboard.css'; // Ensure the path is correct
import axios from 'axios';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleReminderClick = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reminder', {
        params: {
          username: localStorage.getItem('username')
        }
      });
      const { approvedCount, uploadedCertificatesCount } = response.data;
      alert(`You have ${approvedCount} approved OD requests and ${uploadedCertificatesCount} uploaded certificates.`);
    } 
    catch (error) {
      console.error('Error fetching reminder data:', error);
      alert('Failed to fetch reminder data.');
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="header">
        <img src="/images/profile.jpg" alt="Profile" className="profile-image" />
        <div className="welcome-message">
          WELCOME , {localStorage.getItem('name')} [{localStorage.getItem('username')}]
        </div>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-content">
        <div className="sidebar">
          <button className="btn" onClick={() => navigate('od_request')}>OD Request</button>
          <button className="btn" onClick={() => navigate('upload_certificate')}>Upload Certificate</button>
          <button className="btn" onClick={() => navigate('view_uploaded_details')}>View Uploaded Details</button>
          <button className="btn" onClick={handleReminderClick}>Reminder</button>
          <button className="btn" onClick={() => navigate('od_status')}>OD Status</button>
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
