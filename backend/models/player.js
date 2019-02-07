const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  dateOfBirth: { type: String, required: false },
  sex: { type: String, required: false },
  number: { type: String, required: false },
  division: { type: String, required: false },
  status: { type: String, required: false },
  imagePath: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Player', playerSchema);
