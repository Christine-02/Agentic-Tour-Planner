// routes/trips.js
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { authenticate } = require('../middleware/auth');

// All trip routes require authentication
router.use(authenticate);

// GET all trips for the authenticated user
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(trips);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET trip by ID (only if it belongs to the user)
router.get('/:id', async (req, res) => {
  try {
    const t = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!t) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(t);
  } catch (e) {
    res.status(404).json({ error: 'Trip not found' });
  }
});

// POST create new trip
router.post('/', async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      userId: req.user._id,
    };
    const t = new Trip(tripData);
    const saved = await t.save();
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT update trip (only if it belongs to the user)
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const t = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!t) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(t);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH partial update trip (only if it belongs to the user)
router.patch('/:id', async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const t = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!t) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(t);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE trip (only if it belongs to the user)
router.delete('/:id', async (req, res) => {
  try {
    const t = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!t) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully', id: req.params.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
