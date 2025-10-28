const express = require('express');
const Memory = require('../models/Memory');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all memories for the logged-in user (with search)
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user._id };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const memories = await Memory.find(query)
      .sort({ createdAt: -1 });
    res.json(memories);
  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({ error: 'Failed to get memories' });
  }
});

// Create a new memory
router.post('/', auth, async (req, res) => {
  try {
    console.log('📝 Creating memory for user:', req.user.email);
    console.log('📝 Request body:', req.body);
    
    const { title, date, location, description, images } = req.body;

    const memory = new Memory({
      userId: req.user._id,
      title,
      date,
      location,
      description,
      images
    });

    await memory.save();
    console.log('✅ Memory saved successfully:', memory._id);
    res.status(201).json({ message: 'Memory created successfully', memory });
  } catch (error) {
    console.error('❌ Create memory error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to create memory: ' + error.message });
  }
});

// Update a memory
router.put('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const { title, date, location, description, images } = req.body;
    memory.title = title || memory.title;
    memory.date = date || memory.date;
    memory.location = location || memory.location;
    memory.description = description || memory.description;
    memory.images = images || memory.images;

    await memory.save();
    res.json({ message: 'Memory updated successfully', memory });
  } catch (error) {
    console.error('Update memory error:', error);
    res.status(500).json({ error: 'Failed to update memory' });
  }
});

// Delete a memory
router.delete('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    await Memory.deleteOne({ _id: req.params.id });
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

// Get single memory by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    res.json(memory);
  } catch (error) {
    console.error('Get memory error:', error);
    res.status(500).json({ error: 'Failed to get memory' });
  }
});

module.exports = router;

