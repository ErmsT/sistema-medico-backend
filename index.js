const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/api/auth', require('./routes/authRoutes'));

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
