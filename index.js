require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const sallesRoutes = require('./routes/salles');
const sallesProprietaireRoutes = require('./routes/sallesProprietaire');
const typesExercicesRoutes = require('./routes/typesExercices');
const badgesRoutes = require('./routes/badges');
const usersRoutes = require('./routes/users');
const defisRoutes = require('./routes/defis');
const sessionsRoutes = require('./routes/sessions');

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/salles', sallesRoutes);
app.use('/api/v1/proprietaire/salles', sallesProprietaireRoutes);
app.use('/api/v1/types-exercices', typesExercicesRoutes);
app.use('/api/v1/badges', badgesRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/defis', defisRoutes);
app.use('/api/v1/sessions', sessionsRoutes);

// Default route
app.get('/', (req, res) => res.send('API is running'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
