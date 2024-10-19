const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authMiddleware, doctorMiddleware } = require('../middlewares/authMiddleware');

// Rota para registrar médico
router.post('/register', doctorController.registerDoctor);

// Rota para editar médico
router.put('/edit', authMiddleware, doctorMiddleware, doctorController.editDoctor);

// Rota para buscar todos os médicos
router.get('/', authMiddleware, doctorController.getDoctors);

// Rota para vincular um paciente a um médico (apenas médicos podem realizar esta ação)
router.post('/link', authMiddleware, doctorMiddleware, doctorController.linkPatient);

// Rota para desvincular um paciente de um médico (apenas médicos podem realizar esta ação)
router.post('/unlink', authMiddleware, doctorMiddleware, doctorController.unlinkPatient);

module.exports = router;
