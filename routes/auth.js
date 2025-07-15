const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { register, login, protectedRoute } = require('../controllers/authController');
const Joi = require('joi');
const validate = require('../middleware/validate');

const router = express.Router();

// Register validation
const registerSchema = Joi.object({ nom: Joi.string().required(), email: Joi.string().email().required(), password: Joi.string().min(6).required(), role: Joi.string().valid('super_admin','proprietaire_salle','client').required() });
router.post('/register', validate(registerSchema), register);

// Login validation
const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
router.post('/login', validate(loginSchema), login);

router.get('/protected', authenticate, authorizeRoles('super_admin'), protectedRoute);

module.exports = router;
