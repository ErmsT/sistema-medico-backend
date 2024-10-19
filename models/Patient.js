const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  role: { type: String, default: 'patient' },
  passwordHash: { type: String, required: true },
});

patientSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Patient', patientSchema);
