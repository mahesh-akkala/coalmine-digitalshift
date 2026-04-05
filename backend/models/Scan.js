const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  workerId: { type: String, ref: 'Worker', required: true },
  fingerprintId: { type: Number, required: true },
  heartRate: { type: Number, required: true },
  spo2: { type: Number, required: true },
  status: { type: String, required: true } // Safe / Warning / Critical
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
