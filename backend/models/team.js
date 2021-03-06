const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: String, required: true },
  mode: { type: String, required: true },
  coach: { type: String, required: false },
  imagePath: { type: String, required: false },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

module.exports = mongoose.model('Team', teamSchema);
