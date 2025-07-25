const TypesExercice = require('../models/typesExercice');

exports.createTypesExercice = async (req, res) => {
  try {
    const te = new TypesExercice(req.body);
    await te.save();
    res.status(201).json(te);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listTypesExercices = async (req, res) => {
  try {
    const list = await TypesExercice.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTypesExercice = async (req, res) => {
  try {
    const updated = await TypesExercice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'TypesExercice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTypesExercice = async (req, res) => {
  try {
    const deleted = await TypesExercice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'TypesExercice not found' });
    res.json({ message: 'TypesExercice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
