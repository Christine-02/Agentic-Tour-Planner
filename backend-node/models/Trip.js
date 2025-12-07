// models/Trip.js
const mongoose = require('mongoose');
const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destination: String,
  startDate: String,
  endDate: String,
  travelers: { type: Number, default: 1 },
  interests: [String],
  itinerary: Object,
  status: { type: String, default: 'planned' }, // planned, completed, cancelled
  groupMembers: [String], // Array of user IDs or names for future group functionality
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Trip', TripSchema);
