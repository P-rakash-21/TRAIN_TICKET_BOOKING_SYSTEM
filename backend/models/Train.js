const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  trainName: String,
  trainId: String,
  timing: String,
  totalSeats: Number,
  ticketPrice: Number,
  seats: [
    {
      number: Number,
      bookedBy: String || null,
      bookedAt: Date || null
    }
  ]
});

module.exports = mongoose.model('Train', TrainSchema);
