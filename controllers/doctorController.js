const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');

exports.registerDoctor = async (req, res) => {
  const { name, specialty, password } = req.body;

  if (!name || !specialty || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({
      name,
      specialty,
      passwordHash: hashedPassword,
    });

    await doctor.save();
    res.status(201).json({ message: 'Médico registrado com sucesso', doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

exports.editDoctor = async (req, res) => {
  const { name, specialty, password } = req.body;
  const doctorId = req.user.userId;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Médico não encontrado' });

    if (name) doctor.name = name;
    if (specialty) doctor.specialty = specialty;
    if (password) doctor.passwordHash = await bcrypt.hash(password, 10);

    await doctor.save();
    res.status(200).json({ message: 'Dados atualizados com sucesso', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao editar médico' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('patients');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar médicos' });
  }
};


exports.linkPatient = async (req, res) => {
  const { doctorId, patientId } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Médico não encontrado' });
    }
    
    if (doctor.patients.length >= doctor.maxPatients) {
      return res.status(400).json({ message: 'Limite de pacientes atingido' });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    if (patient.doctorId) {
      return res.status(400).json({ message: 'Paciente já vinculado a outro médico' });
    }

    doctor.patients.push(patientId);
    patient.doctorId = doctorId;

    await doctor.save();
    
    await patient.save();

    res.json({ message: 'Paciente vinculado com sucesso', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao vincular paciente' });
  }
};

exports.unlinkPatient = async (req, res) => {
  const { doctorId, patientId } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Médico não encontrado' });

    const patientIndex = doctor.patients.indexOf(patientId);
    if (patientIndex === -1) {
      return res.status(400).json({ message: 'Paciente não vinculado a este médico' });
    }

    doctor.patients.splice(patientIndex, 1);
    const patient = await Patient.findById(patientId);
    patient.doctorId = null;

    await doctor.save();
    await patient.save();

    res.json({ message: 'Paciente desvinculado com sucesso', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao desvincular paciente' });
  }
};
