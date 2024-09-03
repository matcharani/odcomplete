import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './mentor.css';

function Dashboard() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = localStorage.getItem('username');
        if (!storedUsername) {
          console.error('No username found in localStorage');
          return;
        }
        const response = await axios.get(`http://localhost:3000/userinfo?username=${storedUsername}`);
        if (response.data) {
          console.log('User data:', response.data); // Debugging: log the response data
          setName(response.data.name);
          setUsername(response.data.username); // Ensure username is correctly set
        } else {
          console.error('No user data found in response');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
   
    </div>
  );
}

export default Dashboard;
