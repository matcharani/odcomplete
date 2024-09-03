import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; 
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login',{ username, password });
      setMessage(response.data.message);
      if (response.data.role && response.data.name) {
        localStorage.setItem('username', username);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('id', response.data.id);
        switch (response.data.role) {
          case 'student':
            navigate('/student_dashboard');
            break;
          case 'mentor':
            navigate('/mentor_dashboard');
            break;
          case 'class_incharge':
            navigate('/class_incharge_dashboard');
            break;
          case 'hod':
            navigate('/hod_dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setMessage('Role or name not found in the response');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred');
      }
    }
  };

  return (
    <>
      <div className="header">
        <img src="/images/profile.jpg" alt="Profile" className="profile-image" />
        <h1>Velammal College Of Engineering and Technology</h1>
      </div>
      <h2>Student OD management System</h2>
      <div className='div'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className='button' type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default Login;