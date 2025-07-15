const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { validate, schemas } = require('../middleware/validation');
const { requestSalle, listMySalles, updateMySalle } = require('../controllers/salleProprietaireController');

const router = express.Router();
router.use(authenticate, authorizeRoles('proprietaire_salle'));

// Submit a new salle request (status en_attente) with validation
router.post('/demande', validate(schemas.salle.create), requestSalle);

router.get('/mienne', listMySalles);

router.put('/mienne', validate(schemas.salle.update), updateMySalle);

module.exports = router;
