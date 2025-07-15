const express = require('express');
const Defi = require('../models/defi');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { proposeDefi } = require('../controllers/defisProprietaireController');

const router = express.Router();

// Only proprietaire_salle can access these routes
router.use(authenticate, authorizeRoles('proprietaire_salle'));

router.post('/proposer', proposeDefi);

module.exports = router;
