const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const {
  createDefi,
  listDefis,
  updateDefi,
  approveDefi,
  deleteDefi
} = require('../controllers/defiController');

const router = express.Router();

// Defi routes using controllers
router.post('/', authenticate, authorizeRoles('client'), createDefi);
router.get('/', authenticate, authorizeRoles('client'), listDefis);
router.put('/:id/approuver', authenticate, authorizeRoles('super_admin'), approveDefi);
router.put('/:id', authenticate, authorizeRoles('super_admin'), updateDefi);
router.delete('/:id', authenticate, authorizeRoles('super_admin'), deleteDefi);

module.exports = router;

