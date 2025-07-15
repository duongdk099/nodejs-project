const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { validate, schemas } = require('../middleware/validation');
const {
  createDefi,
  listDefis,
  updateDefi,
  approveDefi,
  deleteDefi
} = require('../controllers/defiController');

const router = express.Router();

// Defi routes using controllers with validation
router.post('/', authenticate, authorizeRoles('client'), validate(schemas.defi.create), createDefi);
router.get('/', authenticate, authorizeRoles('client'), listDefis);
router.put('/:id/approuver', authenticate, authorizeRoles('super_admin'), approveDefi);
router.put('/:id', authenticate, authorizeRoles('super_admin'), validate(schemas.defi.update), updateDefi);
router.delete('/:id', authenticate, authorizeRoles('super_admin'), deleteDefi);

module.exports = router;

