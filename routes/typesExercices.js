const express = require('express');
const TypesExercice = require('../models/typesExercice');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

const router = express.Router();

// Protect all routes: only super_admin
router.use(authenticate, authorizeRoles('super_admin'));

// Create a new TypesExercice
router.post('/', async (req, res) => {
  try {
    const te = new TypesExercice(req.body);
    await te.save();
    res.status(201).json(te);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all TypesExercices
router.get('/', async (req, res) => {
  try {
    const list = await TypesExercice.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update TypesExercice
router.put('/:id', async (req, res) => {
  try {
    const updated = await TypesExercice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'TypesExercice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete TypesExercice
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TypesExercice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'TypesExercice not found' });
    res.json({ message: 'TypesExercice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
