// routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Complaint = require('../models/ticket');
const User = require('../models/user');
const requireAuth = require('../middleware/auth')

router.post('/register', async (req, res) => {
  try {
      const { username, email, password } = req.body;

      if (!username || !email || !password ) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).json({ error: 'Email is already registered' });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: encryptedPassword });
      await user.save();

      const token = jwt.sign({ user: user.email }, process.env.JWT_SECRET);

      res.json({ success: true, token, user: username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { userType, email, password } = req.body;

  try {
    if (userType === 'admin') {
      const adminUsername = 'admin@gmail.com';
      const adminPassword = 'adminpassword';

      if (email === adminUsername && password === adminPassword) {
        const token = jwt.sign({ admin: true }, process.env.JWT_SECRET);
        return res.json({ token });
      }

      return res.status(404).json({ message: 'Admin not found' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId : user._id,username : user.username }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/get_ticket', requireAuth, async (req, res) => {
  try {
    // Retrieve complaints created by the authenticated user
    const complaints = await Complaint.find({ user: req.user.username });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/create', requireAuth,async (req, res) => {
  const { title, description } = req.body;
  
  try {
    // Create a new complaint with a unique _id
    const newComplaint = new Complaint({
      user: req.user.username, // Assign the username obtained from the authenticated user
      title: title,
      description: description,
    });

    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/delete/:id',requireAuth, async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;


// router.post('/create', requireAuth, async (req, res) => {
//   const { title, description } = req.body;
  
//   // Obtain the user ID from the authenticated user's token
//   const user1 = req.user.username;
//   console.log(user1)
//   const complaint = new Complaint({
//     user: user1, // Assign the user ID obtained from the token
//     title: title,
//     description: description,
//   });

//   try {
//     const newComplaint = await complaint.save();
//     res.status(201).json(newComplaint);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });