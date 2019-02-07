const mongoose = require('mongoose');

const courtSchema = mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: false },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  imagePath: { type: String, required: false },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Court', courtSchema);
