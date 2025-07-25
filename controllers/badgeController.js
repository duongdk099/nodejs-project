const Badge = require('../models/badge');

exports.createBadge = async (req, res) => {
  try {
    const badge = new Badge(req.body);
    await badge.save();
    res.status(201).json(badge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listBadges = async (req, res) => {
  try {
    const list = await Badge.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBadge = async (req, res) => {
  try {
    const updated = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Badge not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBadge = async (req, res) => {
  try {
    const deleted = await Badge.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Badge not found' });
    res.json({ message: 'Badge deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
