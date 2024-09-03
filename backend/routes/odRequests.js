// routes/odRequest.js

const express = require('express');
const router = express.Router();
const OdRequest = require('../models/odrequest');

// Route to handle POST requests for OD requests
router.post('/', async (req, res) => {
  const { roll_no, student_name, company_name, college_name, program_name, start_date, end_date, events, mentor_id, campus_selection, contacted_phone_number, parent_phone_number ,student_email} = req.body;

  if (!roll_no || !student_name || !company_name || !college_name || !program_name || !start_date || !end_date || !events || !mentor_id || !campus_selection || !contacted_phone_number || !parent_phone_number||!student_email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Create a new OdRequest object using the data from the request body
  const newRequest = new OdRequest({
    roll_no,
    student_name,
    company_name,
    college_name,
    program_name,
    start_date,
    end_date,
    events,
    mentor_id,
    student_email,
    campus_selection,
    contacted_phone_number,
    parent_phone_number
  });

  try {
    // Save the new request to the database
    const savedRequest = await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully', data: savedRequest });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'An error occurred while submitting the request', error: error.message });
  }
});

// Route to fetch OD requests for a specific mentor
router.get('/mentor/:mentorId', async (req, res) => {
  const { mentorId } = req.params;

  try {
    const requests = await OdRequest.find({ mentor_id: mentorId, mentor_approval_status: 'pending' });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'An error occurred while fetching the requests', error: error.message });
  }
});

// Route to fetch mentor ID by student roll number
router.get('/student/:rollNumber', async (req, res) => {
  const { rollNumber } = req.params;

  try {
    const student = await User.findOne({ roll_no: rollNumber });
    if (student && student.mentor_id) {
      const mentor = await Mentor.findById(student.mentor_id);
      res.status(200).json({ mentor_id: student.mentor_id, mentor_name: mentor.name });
    } else {
      res.status(404).json({ message: 'Student or mentor ID not found' });
    }
  } catch (error) {
    console.error('Error fetching mentor ID:', error);
    res.status(500).json({ message: 'An error occurred while fetching the mentor ID', error: error.message });
  }
});



module.exports = router;
