const Salle = require('../models/salle');

exports.createSalle = async (req, res) => {
  try {
    const salle = new Salle(req.body);
    await salle.save();
    res.status(201).json(salle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSalle = async (req, res) => {
  try {
    const updated = await Salle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Salle not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSalle = async (req, res) => {
  try {
    const deleted = await Salle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Salle not found' });
    res.json({ message: 'Salle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listSalles = async (req, res) => {
  try {
    const salles = await Salle.find();
    res.json(salles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveSalle = async (req, res) => {
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
};
