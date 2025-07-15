const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { requestSalle, listMySalles, updateMySalle } = require('../controllers/salleProprietaireController');

const router = express.Router();
router.use(authenticate, authorizeRoles('proprietaire_salle'));

// Submit a new salle request (status en_attente)
router.post('/demande', requestSalle);

router.get('/mienne', listMySalles);

router.put('/mienne', updateMySalle);

module.exports = router;
