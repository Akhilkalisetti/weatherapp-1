const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const travelerAuthRoutes = require('./routes/travelers');
const employeeAuthRoutes = require('./routes/employees');
const companyAuthRoutes = require('./routes/companies');
const memoryRoutes = require('./routes/memories');
const userRoutes = require('./routes/users');
const weatherRoutes = require('./routes/weather');
const messageRoutes = require('./routes/messages');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Atlas connection - Shared by all modules (Employees, Messages, Weather, etc.)
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📊 Database:', process.env.MONGO_URI.split('/').pop().split('?')[0]);
  console.log('🔗 All modules (Employee, Message, Weather, etc.) use this shared connection');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes); // legacy/mixed roles
app.use('/api/travelers/auth', travelerAuthRoutes);
app.use('/api/employees/auth', employeeAuthRoutes);
app.use('/api/companies/auth', companyAuthRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
});

