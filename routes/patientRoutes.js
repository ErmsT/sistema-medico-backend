const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authMiddleware, patientMiddleware } = require('../middlewares/authMiddleware');

// Rota para registrar paciente
router.post('/register', patientController.registerPatient);

// Rota para editar paciente
router.put('/edit', authMiddleware, patientMiddleware, patientController.editPatient);

// Rota para buscar todos os pacientes
router.get('/', authMiddleware, patientController.getPatients);

// Rota para o paciente vincular-se a um médico
router.post('/link', authMiddleware, patientMiddleware, patientController.linkToDoctor);

module.exports = router;
