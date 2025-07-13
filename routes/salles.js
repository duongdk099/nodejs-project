const express = require('express');
const Salle = require('../models/salle');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

const router = express.Router();

router.use(authenticate, authorizeRoles('super_admin'));

router.post('/', async (req, res) => {
  try {
    const salle = new Salle(req.body);
    await salle.save();
    res.status(201).json(salle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update salle
router.put('/:id', async (req, res) => {
  try {
    const updated = await Salle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Salle not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Salle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Salle not found' });
    res.json({ message: 'Salle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const salles = await Salle.find();
    res.json(salles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/approuver', async (req, res) => {
  try {
    const salle = await Salle.findByIdAndUpdate(
      req.params.id,
      { statut: 'approuve' },
      { new: true }
    );
    if (!salle) return res.status(404).json({ message: 'Salle not found' });
    res.json(salle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
