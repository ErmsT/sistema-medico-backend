const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

const doctorMiddleware = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Acesso permitido apenas para médicos' });
  }
  next();
};

const patientMiddleware = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ message: 'Acesso permitido apenas para pacientes' });
  }
  next();
};

module.exports = { authMiddleware, doctorMiddleware, patientMiddleware };
