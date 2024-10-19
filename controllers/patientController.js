const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');

exports.registerPatient = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = new Patient({
      name,
      passwordHash: hashedPassword,
    });

    await patient.save();
    res.status(201).json({ message: 'Paciente registrado com sucesso', patient });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar paciente' });
  }
};

exports.editPatient = async (req, res) => {
  const { name, password } = req.body;
  const patientId = req.user.userId;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Paciente não encontrado' });

    if (name) patient.name = name;
    if (password) patient.passwordHash = await bcrypt.hash(password, 10);

    await patient.save();
    res.status(200).json({ message: 'Dados atualizados com sucesso', patient });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao editar paciente' });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pacientes' });
  }
};

exports.linkToDoctor = async (req, res) => {
  const { doctorId } = req.body;
  const patientId = req.user.userId;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Médico não encontrado' });

    const patient = await Patient.findById(patientId);
    if (patient.doctorId) {
      return res.status(400).json({ message: 'Paciente já está vinculado a outro médico' });
    }

    doctor.patients.push(patientId);
    patient.doctorId = doctorId;

    await doctor.save();
    await patient.save();

    res.json({ message: 'Vínculo realizado com sucesso', doctor });
  } catch (error) {
    console.error('Erro ao vincular paciente ao médico:', error);
    res.status(500).json({ message: 'Erro ao vincular paciente ao médico' });
  }
};