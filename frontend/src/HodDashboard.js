// HodDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './mentor.css'; // Make sure you have your CSS file set up

const HodDashboard = () => {
  const [staffName, setStaffName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/userinfo?username=${localStorage.getItem('username')}`);
        setStaffName(response.data.name); // Assuming the backend response has 'name' field for HOD
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('name'); // Assuming name is stored in localStorage
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <img src="/images/profile.jpg" alt="Profile" className="profile-image" />
        <div className="welcome"><b>Welcome, {staffName}</b></div>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="content">
        <button className="btn" onClick={() => navigate('/hod_approval')}>OD Approval</button>
        <button className="btn" onClick={() => navigate('/check_defaulters')}>Check Defaulters</button>
        <button className="btn" onClick={() => navigate('/uploaded_details')}>View Uploaded Details</button>
      </div>
    </div>
  );
};

export default HodDashboard;
