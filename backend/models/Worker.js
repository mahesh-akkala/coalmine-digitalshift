const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. W101
  fingerprintId: { type: Number, unique: true }, // Fingerprint Sensor Template ID
  name: { type: String, required: true },
  age: { type: Number },
  department: { type: String },
  zone: { type: String },
  phone: { type: String },
  status: { type: String, default: 'Outside' }, // Inside / Outside
  healthEligibility: { type: String, default: 'Safe' },
  lastCheckIn: { type: Date },
  lastCheckOut: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);
