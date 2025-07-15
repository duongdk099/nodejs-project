const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { validate, schemas } = require('../middleware/validation');
const {
  createTypesExercice,
  listTypesExercices,
  updateTypesExercice,
  deleteTypesExercice
} = require('../controllers/typesExerciceController');

const router = express.Router();
router.use(authenticate, authorizeRoles('super_admin'));

router.post('/', validate(schemas.typesExercice.create), createTypesExercice);
router.get('/', listTypesExercices);
router.put('/:id', validate(schemas.typesExercice.update), updateTypesExercice);
router.delete('/:id', deleteTypesExercice);

module.exports = router;
