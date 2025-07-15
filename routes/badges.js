const express = require('express');
const Badge = require('../models/badge');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

const router = express.Router();

// Protect all routes: only super_admin
router.use(authenticate, authorizeRoles('super_admin'));

// Create a new Badge
router.post('/', async (req, res) => {
  try {
    const badge = new Badge(req.body);
    await badge.save();
    res.status(201).json(badge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all Badges
router.get('/', async (req, res) => {
  try {
    const list = await Badge.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Badge
router.put('/:id', async (req, res) => {
  try {
    const updated = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Badge not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Badge
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Badge.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Badge not found' });
    res.json({ message: 'Badge deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
