const express = require('express');
const jwt = require('jsonwebtoken');
const Traveler = require('../models/Traveler');
const router = express.Router();

// Traveler register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await Traveler.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Account already exists' });
    }

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`;
    const doc = new Traveler({ email, password, name, avatar });
    await doc.save();

    const token = jwt.sign(
      { userId: doc._id, email: doc.email, role: 'traveler' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Traveler created successfully',
      token,
      user: { id: doc._id, email: doc.email, name: doc.name, role: 'traveler', avatar: doc.avatar }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create traveler' });
  }
});

// Traveler login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    const doc = await Traveler.findOne({ email });
    if (!doc) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await doc.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: doc._id, email: doc.email, role: 'traveler' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: { id: doc._id, email: doc.email, name: doc.name, role: 'traveler', avatar: doc.avatar }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;


