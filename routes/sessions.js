const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { createSession, listSessions } = require('../controllers/sessionController');

const router = express.Router();

// Client routes for sessions
router.post('/', authenticate, authorizeRoles('client'), createSession);
router.get('/', authenticate, authorizeRoles('client'), listSessions);

module.exports = router;
