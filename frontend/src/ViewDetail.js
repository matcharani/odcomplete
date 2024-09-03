import React, { useEffect, useState } from 'react';
import axios from 'axios';


const ViewDetail = () => {
  const roll_no = localStorage.getItem('username');
  const [certificates, setCertificates] = useState([]);
  const [odRequests, setOdRequests] = useState([]);
  const [error, setError] = useState(null);

  // Fetch certificates and OD requests on component mount
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const certResponse = await axios.get(`http://localhost:3000/certificates/${roll_no}`);
        if (certResponse.data.success) {
          setCertificates(certResponse.data.data);
        } else {
          setError(certResponse.data.message || 'Failed to fetch certificates.');
        }
      } catch (err) {
        setError('Error fetching certificates.');
      }
    };

    const fetchOdRequests = async () => {
      try {
        const odResponse = await axios.get(`http://localhost:3000/ods/${roll_no}`);
        if (odResponse.data.success) {
          setOdRequests(odResponse.data.data);
        } else {
          setError(odResponse.data.message || 'Failed to fetch OD requests.');
        }
      } catch (err) {
        setError('Error fetching OD requests.');
      }
    };

    fetchCertificates();
    fetchOdRequests();
  }, [roll_no]);

  // Handle click to view certificate
  const handleViewCertificate = (certificatePath) => {
    window.open(`http://localhost:3000/${certificatePath}`, '_blank');
  };

  return (
    <div>

      {/* Display OD Requests */}
      <div>
        <h2>Uploaded Certificate Details</h2>
        {odRequests.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student Name</th>
                <th>Company/College</th>
                <th>Program/Event</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Certificates</th>
              </tr>
            </thead>
            <tbody>
              {odRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request._id}</td>
                  <td>{request.student_name}</td>
                  <td>{request.company_name}</td>
                  <td>{request.program_name}</td>
                  <td>{new Date(request.start_date).toLocaleDateString()}</td>
                  <td>{new Date(request.end_date).toLocaleDateString()}</td>
                  <td>
                    {request.certificate_uploaded ? (
                      <button onClick={() => handleViewCertificate(request.certificate_path)}>View Certificate</button>
                    ) : (
                      'No certificate uploaded'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
        <> <center><h3>No Certificate Uploaded Yet.</h3></center></>
        )}
      </div>

      {/* Display Error */}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ViewDetail;
