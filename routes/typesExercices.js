const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const {
  createTypesExercice,
  listTypesExercices,
  updateTypesExercice,
  deleteTypesExercice
} = require('../controllers/typesExerciceController');

const router = express.Router();
router.use(authenticate, authorizeRoles('super_admin'));

router.post('/', createTypesExercice);
router.get('/', listTypesExercices);
router.put('/:id', updateTypesExercice);
router.delete('/:id', deleteTypesExercice);

module.exports = router;
