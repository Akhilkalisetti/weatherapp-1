const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth header:', authHeader ? 'Present' : 'Missing');
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded for user:', decoded.userId);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('✅ Authenticated user:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Check if user is employee or admin
const isEmployee = (req, res, next) => {
  if (req.user.role !== 'employee' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Employee or Admin only.' });
  }
  next();
};

module.exports = { auth, isAdmin, isEmployee };

