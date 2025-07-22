const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { createSalle, listSalles, updateSalle, deleteSalle, approveSalle } = require('../controllers/salleController');

const router = express.Router();
router.use(authenticate, authorizeRoles('super_admin'));

router.post('/', createSalle);
router.get('/', listSalles);
router.put('/:id', updateSalle);
router.delete('/:id', deleteSalle);
router.put('/:id/approuver', approveSalle);

module.exports = router;
