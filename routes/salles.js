const express = require('express');
const Joi = require('joi');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { createSalle, listSalles, updateSalle, deleteSalle, approveSalle } = require('../controllers/salleController');

const router = express.Router();
router.use(authenticate, authorizeRoles('super_admin'));

// Validation schema for creating a salle
const createSalleSchema = Joi.object({
  nom: Joi.string().required(),
  capacite: Joi.number().required(),
  equipements: Joi.array().items(Joi.string()),
  caracteristiques: Joi.object().optional(),
  type_exercices: Joi.array().items(Joi.string().hex().length(24)),
  niveau_difficulte: Joi.string(),
  proprietaire_id: Joi.string().hex().length(24).required(),
  statut: Joi.string().valid('approuve','en_attente'),
  adresse: Joi.string(),
  contact: Joi.string()
});
router.post('/', validate(createSalleSchema), createSalle);
router.get('/', listSalles);
router.put('/:id', updateSalle);
router.delete('/:id', deleteSalle);
router.put('/:id/approuver', approveSalle);
