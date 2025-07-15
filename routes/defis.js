const express = require('express');
const Defi = require('../models/defi');
const User = require('../models/user');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

const router = express.Router();

// Client routes
// Create a new defi
router.post('/', authenticate, authorizeRoles('client'), async (req, res) => {
  try {
    const defi = new Defi({
      ...req.body,
      createur_id: req.user.id,
      statut: 'propose'
    });
    await defi.save();
    res.status(201).json(defi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Explore defis with filters and pagination
router.get('/', authenticate, authorizeRoles('client'), async (req, res) => {
  try {
    const { difficulte, type, minDuree, maxDuree, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (difficulte) filter.difficulte = difficulte;
    if (type) filter.exercices = type;
    if (minDuree || maxDuree) filter.duree = {};
    if (minDuree) filter.duree.$gte = Number(minDuree);
    if (maxDuree) filter.duree.$lte = Number(maxDuree);
    const defis = await Defi.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(defis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Share defi (mark invited or generate a shareable link)
router.post('/:id/partager', authenticate, authorizeRoles('client'), async (req, res) => {
  // Placeholder logic: return a shareable URL
  res.json({ url: `${req.protocol}://${req.get('host')}/api/defis/${req.params.id}` });
});

// Invite friends
router.post('/:id/inviter', authenticate, authorizeRoles('client'), async (req, res) => {
  try {
    const { friendIds } = req.body;
    const defi = await Defi.findById(req.params.id);
    if (!defi) return res.status(404).json({ message: 'Defi not found' });
    defi.invited = Array.from(new Set([...(defi.invited||[]), ...friendIds]));
    await defi.save();
    res.json(defi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Challenge a user (defier)
router.post('/:id/defier', authenticate, authorizeRoles('client'), async (req, res) => {
  try {
    const { userId } = req.body;
    const defi = await Defi.findById(req.params.id);
    if (!defi) return res.status(404).json({ message: 'Defi not found' });
    defi.participants = Array.from(new Set([...(defi.participants||[]), userId]));
    await defi.save();
    res.json(defi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protect only approve endpoint
router.put('/:id/approuver', authenticate, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const defi = await Defi.findByIdAndUpdate(
      req.params.id,
      { statut: 'approuve' },
      { new: true }
    );
    if (!defi) return res.status(404).json({ message: 'Defi not found' });
    // increase creator's score
    await User.findByIdAndUpdate(defi.createur_id, { $inc: { score: 1 } });
    res.json(defi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
