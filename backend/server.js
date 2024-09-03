require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const router = express.Router();
const axios = require('axios');
const nodemailer = require('nodemailer');



// Import routes
const odRequestsRouter = require('./routes/odRequests');
const mentorApprovalRouter = require('./routes/mentorApproval');
const classInchargeApprovalRouter = require('./routes/classInchargeApprovalRouter');
const hodApprovalRouter = require('./routes/hodApprove');
const odrequest = require('./models/odrequest');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://RitikaSachdeva:18052610@odform.wjyhywi.mongodb.net/Approvals?retryWrites=true&w=majority&appName=ODForm';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connected to MongoDB');
}).on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// Enable Mongoose debug mode
mongoose.set('debug', true);

// Define Schema and Model
const Schema = mongoose.Schema;
const studentSchema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  mentor_id: { type: String, required: true },
  class_incharge_id: { type: String, required: true },
  hod_id: { type: String, required: true },
  roll_number: { type: String, required: true },
  dob: { type: Date, required: true },
});

const Student = mongoose.model('StudentOd', studentSchema, 'StudentOd');

// Routes

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(`Login attempt: username=${username}, password=${password}`);

  try {
    const student = await Student.findOne({ username, password });
    if (student) {
      res.json({ message: `Login successful for ${username}`, name: student.name, role: student.role, id: student.id });
    } else {
      res.status(400).json({ message:`Invalid credentials for ${username} `});
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Info Route
app.get('/userinfo', async (req, res) => {
  const { username } = req.query;

  try {
    const student = await Student.findOne({ username });
    if (student) {
      const mentor = await Student.findOne({ id: student.mentor_id }); // Assuming mentors are also in the Student collection
      res.json({
        username: student.username,
        name: student.name,
        mentor_id: student.mentor_id,
        mentor_name: mentor ? mentor.name : null
      });
    } else {
      res.status(400).json({ message: `User not found for username: ${username}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const OdRequest = mongoose.model("OdRequest");

// OD requests routes
app.get('/user', async (req, res) => {
  console.log('Into To Api');
  try {
    const all = await OdRequest.find({ mentor_approval_status: "approved", classincharge_approval_status: "pending" });
    console.log(all);
    res.status(200).json(all);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  console.log('Into To Api');
  try {
    const all = await OdRequest.find({ classincharge_approval_status: "approved", hod_approval_status: "pending" });
    console.log(all);
    res.status(200).json(all);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/userss', async (req, res) => {
  console.log('Into To Api');
  try {
    const all = await OdRequest.find({ status: "approved" });
    console.log(all);
    res.status(200).json(all);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/odrequests/:roll_no', async (req, res) => {
  try {
    const rollNo = req.params.roll_no;
    const odRequest = await OdRequest.find({ roll_no: rollNo , hod_approval_status: "approved",
      certificate_uploaded:'false'});

    if (odRequest) {
      res.json({ success: true, data: odRequest });
    } else {
      res.status(404).json({ success: false, message: 'OD request not found' });
    }
  } catch (error) {
    console.error('Error fetching OD request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/ods/:roll_no', async (req, res) => {
  try {
    const rollNo = req.params.roll_no;
    const odRequest = await OdRequest.find({ roll_no: rollNo,certificate_uploaded :'true'});

    if (odRequest) {
      res.json({ success: true, data: odRequest });
    } else {
      res.status(404).json({ success: false, message: 'OD request not found' });
    }
  } catch (error) {
    console.error('Error fetching OD request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/odstatus/:roll_no', async (req, res) => {
  try {
    const rollNo = req.params.roll_no;
    const odRequest = await OdRequest.find({ roll_no: rollNo});

    if (odRequest) {
      res.json({ success: true, data: odRequest });
    } else {
      res.status(404).json({ success: false, message: 'OD request not found' });
    }
  } catch (error) {
    console.error('Error fetching OD request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Route to fetch certificates by roll number
app.get('/certificates/:roll_no', async (req, res) => {
  try {
    const rollNo = req.params.roll_no;
    const certificates = fs.readdirSync(path.join(__dirname, 'uploads')).filter(file => file.startsWith(rollNo));
    res.json({ success: true, data: certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const od=mongoose.model("OdRequest");


app.get('/approved-requests-and-certificates', async (req, res) => {
  try {
    const approvedRequests = await od.find({ status: "approved" });

    const requestsWithCertificates = await Promise.all(
      approvedRequests.map(async (request) => {
        const certificates = fs.readdirSync(path.join(__dirname, 'uploads')).filter(file => file.startsWith(request.roll_no));
        return { ...request.toObject(), certificates };
      })
    );

    res.status(200).json({ success: true, data: requestsWithCertificates });
  } catch (error) {
    console.error('Error fetching approved requests and certificates:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/approved-mentees-and-certificates', async (req, res) => {
  try {
    const { mentorId } = req.query;

    if (!mentorId) {
      return res.status(400).json({ success: false, message: 'Mentor ID is required' });
    }

    // Assuming each OD request document has a mentorId field
    const approvedRequests = await od.find({ status: 'approved', mentor_id:mentorId });

    const requestsWithCertificates = await Promise.all(
      approvedRequests.map(async (request) => {
        const certificates = fs
          .readdirSync(path.join(__dirname, 'uploads'))
          .filter(file => file.startsWith(request.roll_no));
        return { ...request.toObject(), certificates };
      })
    );

    res.status(200).json({ success: true, data: requestsWithCertificates });
  } catch (error) {
    console.error('Error fetching approved requests and certificates:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




app.get('/reminder', async (req, res) => {
  const username = req.query.username;
  
  try {
    const approvedCount = await od.countDocuments({ 
      roll_no: username, status: 'approved' });
    const uploadedCertificatesCount = await od.countDocuments({ 
      roll_no: username, certificate_uploaded: true });
    
    res.json({ approvedCount, uploadedCertificatesCount });
  } catch (error) {
    console.error('Error fetching reminder data:', error);
    res.status(500).json({ message: 'Error fetching reminder data' });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload_certificate', upload.single('certificate'), async (req, res) => {
  const { roll_no, request_id } = req.body;

  if (!roll_no) {
    return res.status(400).json({ success: false, message: 'Roll number is missing.' });
  }

  const currentDate = moment().format('YYYY-MM-DD');
  const newFilename = `${roll_no}_${currentDate}${path.extname(req.file.originalname)}`;
  const destinationPath = path.join('uploads', newFilename);

  require('fs').writeFile(destinationPath, req.file.buffer, async (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).json({ success: false, message: 'Error saving file.' });
    }

    try {
      const updatedOdRequest = await od.findByIdAndUpdate(
        request_id,
        { certificate_uploaded: true, certificate_path: destinationPath },
        { new: true }
      );

      if (updatedOdRequest) {
        res.json({ success: true, message: 'Certificate uploaded successfully.' });
      } else {
        res.status(404).json({ success: false, message: 'OD request not found.' });
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
  });
});



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vcetod@gmail.com',
    pass: 'yeok lzvi xsag gtdo', // Use an app password if you have 2-step verification enabled
  },
});

app.post('/send-email', async (req, res) => {
  const { studentEmail, studentName, programName, status } = req.body;

  if (!studentEmail || !studentName || !programName || !status) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const mailOptions = {
    from: 'vcetod@gmail.com',
    to: studentEmail,
    subject: 'OD Request Status',
    text: `Dear ${studentName},\n\nYour OD request for the event "${programName}" has been "${status}".\nKindly Upload Your Certificate Without Fail\nBest regards,\nVelammal College Of Engineering and Technology`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.use('/', router);

// OD Requests Route
app.use('/od_requests', odRequestsRouter);

// Mentor Approval Process Route
app.use('/mentor_approval', mentorApprovalRouter);
app.use('/api/mentor-approval', mentorApprovalRouter);
app.use('/api/classincharge-approval', classInchargeApprovalRouter);
app.use('/api/hod-approval', hodApprovalRouter);

// Serve static files (for certificate links)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
