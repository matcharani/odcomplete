import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './dashboard.css'; // Make sure you have your CSS file set up

const ClassInchargeDashboard= () => {
  const navigate = useNavigate();
  const staffName = localStorage.getItem('name');
  const mentorId = localStorage.getItem('id'); // Use camelCase for variable names
  
  useEffect(() => {
    const storedMentorId = localStorage.getItem('id');
    console.log(storedMentorId);
    if (!storedMentorId) {
      // Handle case where mentor_id is not found in localStorage
      console.error('Mentor ID not found in localStorage');
    }
  }, []);

  const handleLogout = () => {
    // Clear local storage or session storage as needed
    localStorage.clear();
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="dashboard-layout">
      <div className="header">
        <img src="/images/profile.jpg" alt="Profile" className="profile-image" />
        <div className="welcome"><b>Welcome, {staffName}</b></div>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-content">
        <div className="sidebar">
        <button className="btn" onClick={() => navigate('mentor_approvall', { state: { mentorId } })}>Mentees</button>
        <button className="btn" onClick={() => navigate('class_approval', { state: { mentorId } })}>Students</button>

        <button className="btn" onClick={() => navigate('check_defaulters')}>Check Defaulters</button>
        <button className="btn" onClick={() => navigate('uploaded_students')}>View Uploaded Details</button>
        <button className="btn" onClick={() => navigate('mentee_update')}>Check OD Updates</button>
      </div>
        <div className="main-content">
          <Outlet />
        </div>
    </div>
     </div>
  );
};

export default ClassInchargeDashboard;