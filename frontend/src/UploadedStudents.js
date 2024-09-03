import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadedMentees() {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    certificateStatus: ''  // New filter for certificate status
  });

  const fetchApprovedRequestsAndCertificates = async () => {
    try {
      const response = await axios.get('http://localhost:3000/approved-requests-and-certificates');
      setApprovedRequests(response.data.data);
      setFilteredRequests(response.data.data);
      if (response.data.data.length === 0) {
        setStatusMessage('No approved OD requests found.');
      }
    } catch (error) {
      console.error('Error fetching approved OD requests and certificates:', error);
      setStatusMessage('Error fetching approved OD requests and certificates.');
    }
  };

  useEffect(() => {
    fetchApprovedRequestsAndCertificates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, approvedRequests]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    let filtered = approvedRequests;

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(request => new Date(request.start_date) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter(request => new Date(request.end_date) <= endDate);
    }

    if (filters.certificateStatus) {
      filtered = filtered.filter(request => 
        filters.certificateStatus === 'uploaded'
          ? request.certificates.length > 0
          : request.certificates.length === 0
      );
    }

    setFilteredRequests(filtered);

    if (filtered.length === 0) {
      setStatusMessage('No data available for the provided filters.');
    } else {
      setStatusMessage('');
    }
  };

  return (
    <div className="approved-requests-container">
      <h2>Approved OD Requests and Certificates</h2>
      
      <div className="filters">
        <label>
          Start Date:
          <input 
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleFilterChange} 
          />
        </label>
        <label>
          End Date:
          <input 
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleFilterChange} 
          />
        </label>
        <label>
          Certificate Status:
          <select 
            name="certificateStatus" 
            value={filters.certificateStatus} 
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="uploaded">Uploaded</option>
            <option value="notUploaded">Not Uploaded</option>
          </select>
        </label>
      </div>
      
      {statusMessage ? (
        <p>{statusMessage}</p>
      ) : (
        <table className="approved-requests-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Student Name</th>
              <th>Company/College</th>
              <th>Program/Event</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Events</th>
              <th>Certificates</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => (
              <tr key={request._id}>
                <td>{index + 1}</td>
                <td>{request.student_name}</td>
                <td>{request.company_name}</td>
                <td>{request.program_name}</td>
                <td>{new Date(request.start_date).toLocaleDateString()}</td>
                <td>{new Date(request.end_date).toLocaleDateString()}</td>
                <td>
                  <ul>
                    {request.events.map((event, idx) => (
                      <li key={idx}>{event}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {request.certificates.length > 0 ? (
                      request.certificates.map((certificate, idx) => (
                        <li key={idx}>
                          <a href={`http://localhost:3000/uploads/${certificate}`} target="_blank" rel="noopener noreferrer">
                            {certificate}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>No certificates uploaded</li>
                    )}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UploadedMentees;
