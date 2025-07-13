const mongoose = require('mongoose');
const { Schema } = mongoose;

const salleSchema = new Schema({
  nom: { type: String, required: true },
  capacite: { type: Number, required: true },
  equipements: [{ type: String }],
  caracteristiques: { type: Schema.Types.Mixed },
  type_exercices: [{ type: Schema.Types.ObjectId, ref: 'TypesExercice' }],
  niveau_difficulte: { type: String },
  proprietaire_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  statut: { type: String, enum: ['approuve', 'en_attente'], default: 'en_attente' },
  adresse: { type: String },
  contact: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Salle', salleSchema);
