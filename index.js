require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const sallesRoutes = require('./routes/salles');
const sallesProprietaireRoutes = require('./routes/sallesProprietaire');
const typesExercicesRoutes = require('./routes/typesExercices');
const badgesRoutes = require('./routes/badges');
const usersRoutes = require('./routes/users');
const defisRoutes = require('./routes/defis');
const sessionsRoutes = require('./routes/sessions');

const app = express();

// Sécurité et middleware
app.use(helmet()); // Protection des en-têtes HTTP
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Domaines autorisés
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined')); // Journalisation

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true, // Retourne les informations de limite dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactiver les en-têtes `X-RateLimit-*` 
  message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use('/api/', apiLimiter);

// Parser pour le JSON
app.use(express.json({ limit: '10kb' })); // Limite la taille des requêtes JSON

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
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
