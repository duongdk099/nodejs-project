const Defi = require('../models/defi');
const Salle = require('../models/salle');

exports.proposeDefi = async (req, res) => {
  try {
    const { salle_id, titre, objectifs, exercices, duree, difficulte, score_bonus } = req.body;
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
};
