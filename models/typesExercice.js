const mongoose = require('mongoose');
const { Schema } = mongoose;

const typesExerciceSchema = new Schema({
  nom: { type: String, required: true },
  description: { type: String },
  muscles: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('TypesExercice', typesExerciceSchema);
