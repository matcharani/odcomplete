import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Classapproval = () => {
  const location = useLocation();
  const { mentorId } = location.state || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const request = requests.find(req => req._id === requestId);
      await axios.post('http://localhost:3000/api/hod-approval/approve', {
        requestId,
        status: 'approved',
      });

      await sendEmailToStudent(request, 'approved');

      // Remove the approved request from the local state
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const request = requests.find(req => req._id === requestId);
      await axios.post('http://localhost:3000/api/hod-approval/approve', {
        requestId,
        status: 'rejected',
      });

      await sendEmailToStudent(request, 'rejected');

      // Remove the rejected request from the local state
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const sendEmailToStudent = async (request, status) => {
    const { student_email, student_name, program_name } = request;
    try {
      await axios.post('http://localhost:3000/send-email', {
        studentEmail: student_email,
        studentName: student_name,
        programName: program_name,
        status: status,
      });
    } catch (error) {
      console.error('Error sending email to student:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="content">
      <h2>OD Approval Requests for HOD</h2>
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
                    <button id="b1" onClick={() => handleApprove(request._id)}>Approve</button>
                    <button id="b2" onClick={() => handleReject(request._id)}>Reject</button>
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

export default Classapproval;
