
const express = require('express');
const router = express.Router();
const Complaint = require('../models/ticket');
const requireAuth = require('../middleware/auth')

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) { 
    next(); 
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

router.get('/get_all',requireAuth, verifyAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find({});
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch('/ticket/:id', requireAuth, verifyAdmin, async (req, res) => {
  try {
    const { assignedTo, status } = req.body;
    const updatedFields = {};
    
    if (assignedTo !== undefined) {
      updatedFields.assignedTo = assignedTo;
    }
    if (status !== undefined) {
      updatedFields.status = status;
    }

    const updatedComplaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(updatedComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;




// Assign complaint to an employee (for admin)
// router.put('/ticket/:id', requireAuth,verifyAdmin, async (req, res) => {
//   try {
//     const complaint = await Complaint.findById(req.params.id);
//     if (!complaint) {
//       return res.status(404).json({ message: 'Complaint not found' });
//     }

//     // if (!req.body.assignedTo || !req.body.status) {
//     //   return res.status(400).json({ message: 'Both assignedTo and status fields are required' });
//     // }

//     complaint.assignedTo = req.body.assignedTo;
//     complaint.status = req.body.status;

//     const updatedComplaint = await complaint.save();
//     res.json(updatedComplaint);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// Middleware to verify admin credentials
// const verifyAdmin = (req, res, next) => {
//   const { email, password } = req.body;
  
//   const adminUsername = 'admin';
//   const adminPassword = 'adminpassword';

//   if (email === adminUsername && password === adminPassword) {
//     next();
//   } else {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };