import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const MentorApproval = () => {
  const location = useLocation();
  const { mentorId } = location.state || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    if (mentorId) {
      fetchPendingRequests();
    } else {
      console.error('mentorId is undefined');
    }
  }, [mentorId]);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/mentor-approval/pending/${mentorId}`);
      setRequests(response.data);
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.post('http://localhost:3000/api/mentor-approval/approve', {
        requestId,
        status: 'approved',
      });
      fetchPendingRequests(); // Update the requests after approval
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post('http://localhost:3000/api/mentor-approval/approve', {
        requestId,
        status: 'rejected',
      });
      fetchPendingRequests(); // Update the requests after rejection
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="content">
      <h2>OD Approval Requests for Mentor</h2>
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student Name</th>
                <th>Company/College</th>
                <th>Program/Event</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Events</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request._id}</td>
                  <td>{request.student_name}</td>
                  <td>{request.company_name}</td>
                  <td>{request.program_name}</td>
                  <td>{formatDate(request.start_date)}</td>
                  <td>{formatDate(request.end_date)}</td>
                  <td>{request.events.join(', ')}</td>
                  <td>
                    <button onClick={() => handleApprove(request._id)}>Approve</button>
                    <button onClick={() => handleReject(request._id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MentorApproval;
