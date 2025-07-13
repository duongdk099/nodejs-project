const mongoose = require('mongoose');
const { Schema } = mongoose;

const badgeSchema = new Schema({
  nom: { type: String, required: true },
  description: { type: String },
  regles: { type: Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
