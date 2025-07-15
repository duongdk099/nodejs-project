const Salle = require('../models/salle');

exports.requestSalle = async (req, res) => {
  try {
    const data = req.body;
    data.proprietaire_id = req.user.id;
    data.statut = 'en_attente';
    const salle = new Salle(data);
    await salle.save();
    res.status(201).json(salle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listMySalles = async (req, res) => {
  try {
    const salles = await Salle.find({ proprietaire_id: req.user.id });
    res.json(salles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMySalle = async (req, res) => {
  try {
    const updated = await Salle.findOneAndUpdate(
      { proprietaire_id: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Salle not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
