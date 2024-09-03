import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadCertificate() {
  const [message, setMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [odRequests, setOdRequests] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Retrieve roll number from local storage
  const rollNumber = localStorage.getItem('username');

  const fetchOdRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/odrequests/${rollNumber}`);
      if (response.data.success) {
        setOdRequests(response.data.data);
        if (response.data.data.length === 0) {
          setStatusMessage('No OD Approve found.');
        }
      } else {
        setStatusMessage('No OD Approve found.');
      }
    } catch (error) {
      console.error('Error fetching OD requests:', error);
      setStatusMessage('Error fetching OD requests.');
    }
  };

  useEffect(() => {
    fetchOdRequests();
  }, [rollNumber]);

  useEffect(() => {
    if (statusMessage === 'No OD Approve found.') {
      alert(statusMessage);
    }
  }, [statusMessage]);

  const handleFileUpload = async (e, requestId) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('certificate', e.target.elements.certificate.files[0]);
    formData.append('roll_no', rollNumber);
    formData.append('request_id', requestId);

    try {
      const response = await axios.post('http://localhost:3000/upload_certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: JSON.stringify(formData)
      });

      if (response.data.success) {
        // Update the state of the specific request to reflect the certificate upload
        setOdRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, certificate_uploaded: true } : request
          )
        );
        setMessage('Certificate uploaded successfully.');
      } else {
        setUploadError(response.data.message || 'Failed to upload certificate.');
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      setUploadError(error.response?.data?.message || 'Error uploading certificate.');
    }
  };

  const renderContent = () => {
    if (odRequests.length > 0) {
      return (
        <div className="od-approval-content">
          <h2>Certificate Upload Details</h2>
          <table className="od-approval-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student Name</th>
                <th>Company/College</th>
                <th>Program/Event</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Events</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {odRequests.map((request, index) => {
                const { _id, student_name, company_name, program_name, start_date, end_date, events, hod_approval_status, certificate_uploaded } = request;

                return (
                  <tr key={_id}>
                    <td>{index + 1}</td>
                    <td>{student_name}</td>
                    <td>{company_name}</td>
                    <td>{program_name}</td>
                    <td>{new Date(start_date).toLocaleDateString()}</td>
                    <td>{new Date(end_date).toLocaleDateString()}</td>
                    <td>
                      <ul>
                        {events.map((event, idx) => (
                          <li key={idx}>{event}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {hod_approval_status === 'approved' ? (
                        certificate_uploaded ? (
                          <p>Certificate uploaded successfully.</p>
                        ) : (
                          <form onSubmit={(e) => handleFileUpload(e, _id)} encType="multipart/form-data">
                            <input type="file" id="certificate" name="certificate" required />
                            <input type="submit" value="Upload" />
                          </form>
                        )
                      ) : certificate_uploaded === 'false' ? (
                        <p>No OD requests found.</p>
                      ) : (
                        <p>Certificate is Uploaded</p>
                      )}
                    </td>
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

export default UploadCertificate;
