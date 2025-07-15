const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const Joi = require('joi');
const validate = require('../middleware/validate');
const { createBadge, listBadges, updateBadge, deleteBadge } = require('../controllers/badgeController');

const router = express.Router();

// Protect all routes: only super_admin
router.use(authenticate, authorizeRoles('super_admin'));

// Badge creation validation
const createBadgeSchema = Joi.object({ nom: Joi.string().required(), description: Joi.string().allow(''), regles: Joi.object().required() });
router.post('/', validate(createBadgeSchema), createBadge);

router.get('/', listBadges);

// Badge update validation
const updateBadgeSchema = Joi.object({ nom: Joi.string(), description: Joi.string().allow(''), regles: Joi.object() });
router.put('/:id', validate(updateBadgeSchema), updateBadge);

router.delete('/:id', deleteBadge);

module.exports = router;
