const express = require('express');
const WeatherAbsence = require('../models/WeatherAbsence');
const WorkReport = require('../models/WorkReport');
const { auth, isEmployee, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all weather absence requests (admin only)
router.get('/absence', auth, isAdmin, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { employeeName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await WeatherAbsence.find(query)
      .populate('userId', 'name email avatar')
      .sort({ submittedAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get absence requests error:', error);
    res.status(500).json({ error: 'Failed to get absence requests' });
  }
});

// Get weather absence requests for current user
router.get('/absence/me', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user._id };

    // Add search functionality
    if (search) {
      query.$or = [
        { employeeName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await WeatherAbsence.find(query)
      .sort({ submittedAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get absence requests error:', error);
    res.status(500).json({ error: 'Failed to get absence requests' });
  }
});

// Create weather absence request (employee only)
router.post('/absence', auth, isEmployee, async (req, res) => {
  try {
    const { employeeName, employeeId, location, description, verificationResult } = req.body;

    const request = new WeatherAbsence({
      userId: req.user._id,
      employeeName,
      employeeId,
      location,
      description,
      verificationResult
    });

    await request.save();
    res.status(201).json({ message: 'Weather absence request created', request });
  } catch (error) {
    console.error('Create absence request error:', error);
    res.status(500).json({ error: 'Failed to create absence request' });
  }
});

// Update weather absence request status (admin only)
router.put('/absence/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status, comment } = req.body;
    const request = await WeatherAbsence.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = status || request.status;
    request.comment = comment || request.comment;
    await request.save();

    res.json({ message: 'Request updated successfully', request });
  } catch (error) {
    console.error('Update absence request error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Get work reports (employee and admin)
router.get('/reports', auth, isEmployee, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user._id };

    // Add search functionality
    if (search) {
      query.$or = [
        { project: { $regex: search, $options: 'i' } },
        { tasks: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
    }

    const reports = await WorkReport.find(query)
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Get work reports error:', error);
    res.status(500).json({ error: 'Failed to get work reports' });
  }
});

// Create work report (employee only)
router.post('/reports', auth, isEmployee, async (req, res) => {
  try {
    const { date, project, tasks, location, status, hours } = req.body;

    const report = new WorkReport({
      userId: req.user._id,
      date,
      project,
      tasks,
      location,
      status: status || 'in-progress',
      hours: hours || ''
    });

    await report.save();
    res.status(201).json({ message: 'Work report created', report });
  } catch (error) {
    console.error('Create work report error:', error);
    res.status(500).json({ error: 'Failed to create work report' });
  }
});

// Update work report
router.put('/reports/:id', auth, isEmployee, async (req, res) => {
  try {
    const { date, project, tasks, location, status, hours } = req.body;
    console.log('🔄 Updating work report:', req.params.id);
    console.log('🔄 Update data:', { date, project, tasks, location, status, hours });
    
    const report = await WorkReport.findOne({ _id: req.params.id, userId: req.user._id });

    if (!report) {
      console.log('❌ Report not found:', req.params.id);
      return res.status(404).json({ error: 'Report not found' });
    }

    console.log('📝 Found report:', report);
    console.log('📝 Current report data:', {
      date: report.date,
      project: report.project,
      tasks: report.tasks,
      location: report.location,
      status: report.status,
      hours: report.hours
    });

    report.date = date || report.date;
    report.project = project || report.project;
    report.tasks = tasks || report.tasks;
    report.location = location || report.location;
    report.status = status || report.status;
    report.hours = hours !== undefined ? hours : report.hours;

    console.log('📝 Updated report data:', {
      date: report.date,
      project: report.project,
      tasks: report.tasks,
      location: report.location,
      status: report.status,
      hours: report.hours
    });

    await report.save();
    console.log('✅ Report saved successfully');
    res.json({ message: 'Work report updated successfully', report });
  } catch (error) {
    console.error('❌ Update work report error:', error);
    res.status(500).json({ error: 'Failed to update work report' });
  }
});

// Delete work report
router.delete('/reports/:id', auth, isEmployee, async (req, res) => {
  try {
    const report = await WorkReport.findOne({ _id: req.params.id, userId: req.user._id });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await WorkReport.deleteOne({ _id: req.params.id });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete work report error:', error);
    res.status(500).json({ error: 'Failed to delete work report' });
  }
});

// Delete weather absence request
router.delete('/absence/:id', auth, async (req, res) => {
  try {
    const request = await WeatherAbsence.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if user is admin or owns the request
    if (req.user.role !== 'admin' && request.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await WeatherAbsence.deleteOne({ _id: req.params.id });
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete absence request error:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

module.exports = router;

