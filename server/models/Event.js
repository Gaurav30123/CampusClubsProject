const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  banner: {
    type: String, // URL to the event image
    default: 'https://via.placeholder.com/400x200',
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
