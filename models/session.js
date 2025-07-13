const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  defi_id: { type: Schema.Types.ObjectId, ref: 'Defi', required: true },
  date: { type: Date, default: Date.now },
  calories: { type: Number },
  stats: { type: Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
