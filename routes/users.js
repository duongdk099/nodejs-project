const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { 
  listUsers, 
  deactivateUser, 
  deleteUser, 
  setRole 
} = require('../controllers/userController');

const router = express.Router();

// Protect all routes: only super_admin
router.use(authenticate, authorizeRoles('super_admin'));

// List all users
router.get('/', listUsers);

// Deactivate user
router.put('/:id/desactiver', deactivateUser);

// Set user role
router.put('/:id/role', setRole);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;
