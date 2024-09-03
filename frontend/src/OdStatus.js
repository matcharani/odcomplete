import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OdStatus() {
  const [message, setMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [odRequests, setOdRequests] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Retrieve roll number from local storage
  const rollNumber = localStorage.getItem('username');
  const fetchOdRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/odstatus/${rollNumber}`);
      if (response.data.success) {
        setOdRequests(response.data.data);
      } else {
        setStatusMessage('No OD requests found.');
      }
    } catch (error) {
      console.error('Error fetching OD requests:', error);
      setStatusMessage('Error fetching OD requests.');
    }
  };

  useEffect(() => {
    fetchOdRequests();
  }, [rollNumber]);

  const renderStatus = (status) => {
    switch (status) {
      case 'approved':
        return 'OD Approved';
      case 'pending':
        return 'OD Request Received';
      case 'rejected':
        return 'OD Rejected';
      default:
        return 'Unknown Status';
    }
  };

  const renderContent = () => {
    if (odRequests.length > 0) {
      return (
        <div className="od-approval-content">
          <h2>On Duty Status</h2>
          <table className="od-approval-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student Name</th>
                <th>Company/College</th>
                <th>Program/Event</th>
              
                <th>Events</th>
                <th>Mentor Status</th>
                <th>ClassIncharge Status</th>
                <th>HoD Status</th>
                <th>OD Status</th>

              </tr>
            </thead>
            <tbody>
              {odRequests.map((request, index) => {
                const { _id, student_name, company_name, program_name, events,mentor_approval_status, classincharge_approval_status, hod_approval_status,status } = request;

                return (
                  <tr key={_id}>
                    <td>{index + 1}</td>
                    <td>{student_name}</td>
                    <td>{company_name}</td>
                    <td>{program_name}</td>
                    
                    <td>
                      <ul>
                        {events.map((event, idx) => (
                          <li key={idx}>{event}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{renderStatus(mentor_approval_status)}</td>
                    <td>{renderStatus(classincharge_approval_status)}</td>
                    <td>{renderStatus(hod_approval_status)}</td>
                    <td>{renderStatus(status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {message && <p className="od-approval-message">{message}</p>}
          {uploadError && <p className="od-approval-error-message">{uploadError}</p>}
        </div>
      );
    }

    return <p>{statusMessage}</p>;
  };

  return (
    <div className="od-approval-container">
      <div className="od-approval-form-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default OdStatus;
