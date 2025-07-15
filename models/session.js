const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  defi_id: { type: Schema.Types.ObjectId, ref: 'Defi', required: true },
  date: { type: Date, default: Date.now },
  calories: { type: Number },
  stats: { type: Schema.Types.Mixed }
}, { timestamps: true });
// Post-save hook to assign badges based on rules
sessionSchema.post('save', async function(session) {
  try {
    const Badge = mongoose.model('Badge');
    const User = mongoose.model('User');
    const Session = mongoose.model('Session');
    // Fetch all badges
    const badges = await Badge.find();
    for (const badge of badges) {
      const rules = badge.regles || {};
      let eligible = true;
      // Evaluate each rule
      for (const [key, value] of Object.entries(rules)) {
        if (key === 'sessions') {
          const count = await Session.countDocuments({ user_id: session.user_id });
          if (count < value) eligible = false;
        } else if (key === 'calories') {
          if ((session.calories || 0) < value) eligible = false;
        }
        // TODO: ajouter d'autres types de règles si nécessaire
        if (!eligible) break;
      }
      if (eligible) {
        // Add badge to user if not already present
        await User.findByIdAndUpdate(
          session.user_id,
          { $addToSet: { badges: badge._id } }
        );
      }
    }
  } catch (err) {
    console.error('Badge assignment error:', err);
  }
});

module.exports = mongoose.model('Session', sessionSchema);
