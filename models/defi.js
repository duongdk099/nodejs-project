const mongoose = require('mongoose');
const { Schema } = mongoose;

const defiSchema = new Schema({
  titre: { type: String, required: true },
  objectifs: [{ type: String }],
  exercices: [{ type: Schema.Types.ObjectId, ref: 'TypesExercice' }],
  duree: { type: Number },
  difficulte: { type: String },
  createur_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  salle_id: { type: Schema.Types.ObjectId, ref: 'Salle', required: true },
  statut: { type: String, enum: ['propose', 'approuve'], default: 'propose' },
  score_bonus: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Defi', defiSchema);
