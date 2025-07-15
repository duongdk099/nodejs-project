const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { register, login, protectedRoute } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/protected', authenticate, authorizeRoles('super_admin'), protectedRoute);

module.exports = router;
