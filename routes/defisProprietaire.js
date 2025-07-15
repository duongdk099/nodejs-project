const express = require('express');
const Defi = require('../models/defi');
const Salle = require('../models/salle');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

const router = express.Router();

// Only proprietaire_salle can access these routes
router.use(authenticate, authorizeRoles('proprietaire_salle'));

// Propose a new defi associated to a salle
router.post('/proposer', async (req, res) => {
  const { salle_id, titre, objectifs, exercices, duree, difficulte, score_bonus } = req.body;
  try {
    // Ensure the owner owns the salle
    const salle = await Salle.findOne({ _id: salle_id, proprietaire_id: req.user.id });
    if (!salle) return res.status(404).json({ message: 'Salle not found or unauthorized' });

    const defi = new Defi({
      titre,
      objectifs,
      exercices,
      duree,
      difficulte,
      score_bonus,
      createur_id: req.user.id,
      salle_id,
      statut: 'propose'
    });
    await defi.save();
    res.status(201).json(defi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
