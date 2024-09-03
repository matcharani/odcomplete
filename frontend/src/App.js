import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import ODRequest from './ODRequest';
import Dashboard from './Dashboard';
import Certificateupload from './Certificateupload';
import MentorDashboard from './MentorDashboard';
import ClassInchargeDashboard from './ClassInchargeDashboard';
import HodDashboard from './HodDashboard';
import MentorApproval from './MentorApproval';
import Classapproval from './Classapproval';
import HodApproval from './HodApproval';
import ViewDetail from './ViewDetail';
import DashboardLayout from './DashboardLayout';
import Odstatus from './OdStatus';
import Filterhod from './Filterhod';
import MentorApprovall from './MentorApprovall';
import UploadedMentees from './UploadedMentees';
import UploadedStudents from './UploadedStudents';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student_dashboard" element={<DashboardLayout/>}>
          <Route index element={<Dashboard />} />
          <Route path="od_request" element={<ODRequest />} />
          <Route path="upload_certificate" element={<Certificateupload />} />
          <Route path="view_uploaded_details" element={<ViewDetail />} />
          <Route path="od_status" element={<Odstatus />} />
        </Route>
        <Route path="/mentor_dashboard" element={<MentorDashboard />}>
        <Route path="mentor_approval" element={<MentorApproval />} />
        <Route path="uploaded_mentees" element={<UploadedMentees />} />

        </Route>
        <Route path="/class_incharge_dashboard" element={<ClassInchargeDashboard />} >
          <Route path="class_approval" element={<Classapproval />} />
                  <Route path="mentor_approvall" element={<MentorApprovall />} />
                  <Route path="uploaded_students" element={<UploadedStudents />} />
                  </Route>
        <Route path="/hod_dashboard" element={<HodDashboard />} />
        <Route path="/hod_approval" element={<HodApproval />} />
        <Route path="/uploaded_details" element={<Filterhod />} />

      </Routes>
    </Router>
  );
}

export default App;
