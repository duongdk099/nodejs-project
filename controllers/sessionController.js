const Session = require('../models/session');

exports.createSession = async (req, res) => {
  try {
    const { defi_id, date, calories, stats } = req.body;
    const session = new Session({
      user_id: req.user.id,
      defi_id,
      date,
      calories,
      stats
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
