import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './ODRequest.css';

function ODRequest() {
  const location = useLocation();
  const rollNumber = localStorage.getItem('username');
  const { studentName } = location.state || { studentName: '' };
  const [form, setForm] = useState({
    roll_no: rollNumber,
    student_name: studentName,
    company_name: '',
    college_name: '',
    program_name: '',
    start_date: '',
    end_date: '',
    events: [],
    mentor_id: '',
    mentor_name: '',
    campus_selection: '',
    contacted_phone_number: '',
    parent_phone_number: '',
    student_email: ''  // Added email field
  });

  const [errors, setErrors] = useState({});
  const [mentorName, setMentorName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.get('http://localhost:3000/userinfo', {
          params: { username }
        });
        if (response.data) {
          const { name, mentor_id, mentor_name } = response.data;
          setForm(prevForm => ({
            ...prevForm,
            student_name: name,
            mentor_id: mentor_id
          }));
          setMentorName(mentor_name);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prevForm => ({
        ...prevForm,
        events: checked
          ? [...prevForm.events, value]
          : prevForm.events.filter(event => event !== value)
      }));
    } else {
      setForm(prevForm => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (new Date(form.start_date) < new Date()) {
      validationErrors.start_date = 'Start date must be after the current date.';
    }

    if (new Date(form.start_date) > new Date(form.end_date)) {
      validationErrors.end_date = 'End date must be after the start date.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await axios.post('http://localhost:3000/od_requests', form);
        console.log('Form submitted:', response.data);
        alert('OD request sent successfully!');
        navigate('/student_dashboard');
      } catch (error) {
        console.error('Error submitting form:', error.response ? error.response.data : error.message);
        alert('An error occurred while submitting the request. Please try again.');
      }
    }
  };

  return (
    <div className="odrequest-container">
      <h2>On Duty Form</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            id="roll_no"
            name="roll_no"
            value={form.roll_no}
            readOnly
            required
          />

          <input
            type="hidden"
            id="student_name"
            name="student_name"
            value={form.student_name}
            readOnly
            required
          />

          <label htmlFor="company_name">Name of College/Company:</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="college_name">Address of College/Company:</label>
          <input
            type="text"
            id="college_name"
            name="college_name"
            value={form.college_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="program_name">Name of Programme/Symposium/Event:</label>
          <input
            type="text"
            id="program_name"
            name="program_name"
            value={form.program_name}
            onChange={handleChange}
            required
          />

        
          <label htmlFor="campus_selection">Select Campus:</label>
          <select
            id="campus_selection"
            name="campus_selection"
            value={form.campus_selection}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Campus</option>
            <option value="inside">Inside Campus</option>
            <option value="outside">Outside Campus</option>
          </select>
          <br />

          <label htmlFor="contacted_phone_number">Contacted Person's Phone Number:</label>
          <input
            type="tel"
            id="contacted_phone_number"
            name="contacted_phone_number"
            value={form.contacted_phone_number}
            onChange={handleChange}
            placeholder="Enter contacted person's phone number"
            required
          />

          <label htmlFor="parent_phone_number">Parent's Phone Number:</label>
          <input
            type="tel"
            id="parent_phone_number"
            name="parent_phone_number"
            value={form.parent_phone_number}
            onChange={handleChange}
            placeholder="Enter parent's phone number"
            required
          />

          <label htmlFor="student_email">Student's Email:</label>
          <input
            type="email"
            id="student_email"
            name="student_email"
            value={form.student_email}
            onChange={handleChange}
            placeholder="Enter student's email"
            required
          />

          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
          {errors.start_date && <p className="error-message">{errors.start_date}</p>}

          <label htmlFor="end_date">End Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
          />
          {errors.end_date && <p className="error-message">{errors.end_date}</p>}

          <label>Events Going to Attend:</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="events"
                value="Paper Presentation"
                checked={form.events.includes('Paper Presentation')}
                onChange={handleChange}
              />
              Paper Presentation
            </label>
            <label>
              <input
                type="checkbox"
                name="events"
                value="Project Presentation"
                checked={form.events.includes('Project Presentation')}
                onChange={handleChange}
              />
              Project Presentation
            </label>
            <label>
              <input
                type="checkbox"
                name="events"
                value="Other Events"
                checked={form.events.includes('Other Events')}
                onChange={handleChange}
              />
              Other Events
            </label>
          </div>

          <label htmlFor="mentor_id">Mentor:</label>
          <select
            id="mentor_id"
            name="mentor_id"
            value={form.mentor_id}
            onChange={handleChange}
            required
          >
            {mentorName && <option value={form.mentor_id}>{mentorName}</option>}
          </select>

          <button type="submit">Request</button>
        </form>
      </div>
    </div>
  );
}

export default ODRequest;
