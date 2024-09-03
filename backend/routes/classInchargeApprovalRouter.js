const express = require('express');
const router = express.Router();
const OdRequest = require('../models/odrequest'); // Ensure this matches your model file


// Approve or reject OD request by mentor
router.post('/approve', async (req, res) => {
  const { requestId, status } = req.body;

  try {
    const updatedRequest = await OdRequest.findByIdAndUpdate(
      requestId,
      { classincharge_approval_status: status },
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
