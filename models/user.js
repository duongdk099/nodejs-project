const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'proprietaire_salle', 'client'], default: 'client' },
  statut: { type: Boolean, default: true },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  score: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
