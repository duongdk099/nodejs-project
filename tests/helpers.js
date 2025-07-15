const request = require('supertest');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Configuration de base de l'app pour les tests
app.use(express.json());

// Importer les routes
const authRoutes = require('../routes/auth');
const defisRoutes = require('../routes/defis');
const sallesProprietaireRoutes = require('../routes/sallesProprietaire');
const typesExercicesRoutes = require('../routes/typesExercices');

// Configurer les routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/defis', defisRoutes);
app.use('/api/v1/proprietaire/salles', sallesProprietaireRoutes);
app.use('/api/v1/types-exercices', typesExercicesRoutes);

// Fonction helper pour créer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'testsecretkey',
    { expiresIn: '1d' }
  );
};

// Fonction helper pour créer un utilisateur de test
const createTestUser = async (role = 'client') => {
  const user = new User({
    nom: 'Test',
    prenom: 'User',
    email: `test-${Date.now()}@example.com`,
    password: await require('bcryptjs').hash('password123', 10),
    role: role
  });
  await user.save();
  
  const token = generateToken(user);
  return { user, token };
};

module.exports = {
  app,
  createTestUser,
  generateToken
};
