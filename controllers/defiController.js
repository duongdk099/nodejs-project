const Defi = require('../models/defi');
const User = require('../models/user');

// Create a new Defi (client or proprietaire)
exports.createDefi = async (req, res) => {
  try {
    const data = {
      ...req.body,
      createur_id: req.user.id,
      statut: req.user.role === 'client' ? 'propose' : req.body.statut || 'propose'
    };
    const defi = new Defi(data);
    await defi.save();
    res.status(201).json(defi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List/all defis with optional filters
exports.listDefis = async (req, res) => {
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
};

// Approve a Defi (super_admin)
exports.approveDefi = async (req, res) => {
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
};

// Delete a Defi (super_admin)
exports.deleteDefi = async (req, res) => {
  try {
    const deleted = await Defi.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Defi not found' });
    res.json({ message: 'Defi deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a Defi (super_admin or owner)
exports.updateDefi = async (req, res) => {
  try {
    const updated = await Defi.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Defi not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
