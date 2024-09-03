const express = require('express');
const router = express.Router();
const OdRequest = require('../models/odrequest'); // Ensure this matches your model file

// Fetch pending OD requests for a specific mentor
router.get('/pending/:mentorId', async (req, res) => {
  const { mentorId } = req.params;
  console.log("Controller", mentorId);
  try {
    // Fetch OD requests with pending mentor approval status
    const requests = await OdRequest.find({ mentor_id: mentorId, mentor_approval_status: 'pending' });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve or reject OD request by mentor
router.post('/approve', async (req, res) => {
  const { requestId, status } = req.body;

  try {
    const updatedRequest = await OdRequest.findByIdAndUpdate(
      requestId,
      { mentor_approval_status: status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Approve or reject OD request by mentor
router.post('/approvee', async (req, res) => {
  const { requestId, status } = req.body;

  try {
    const updatedRequest = await OdRequest.findByIdAndUpdate(
      requestId,
      { mentor_approval_status: status ,
        classincharge_approval_status:status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
