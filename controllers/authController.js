const Doctor = require('../models/Doctor'); 
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role, specialty } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    let user;
    let userExists;

    if (role === 'doctor') {
      userExists = await Doctor.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'E-mail já cadastrado para um médico.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new Doctor({
        name,
        email,
        specialty,
        passwordHash: hashedPassword,
        role: 'doctor',
      });

    } else if (role === 'patient') {
      userExists = await Patient.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'E-mail já cadastrado para um paciente.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new Patient({
        name,
        email,
        passwordHash: hashedPassword,
        role: 'patient',
      });
    } else {
      return res.status(400).json({ message: 'Função inválida' });
    }

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role === 'doctor') {
      user = await Doctor.findOne({ email });
    } else if (role === 'patient') {
      user = await Patient.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Função inválida' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};
