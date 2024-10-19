const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialty: { type: String, required: true },
  role: { type: String, default: 'doctor' },
  maxPatients: { type: Number, default: 10 },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  passwordHash: { type: String, required: true },
});

doctorSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Doctor', doctorSchema);
