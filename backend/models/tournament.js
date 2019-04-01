const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  startDate: { type: String, required: false },
  endDate: { type: String, required: false },
  typeOfGame: { type: String, required: false },
  mode: { type: String, required: false },
  category: { type: String, required: false },
  status: { type: String, required: false },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  champion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false
  },
  subchampion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
