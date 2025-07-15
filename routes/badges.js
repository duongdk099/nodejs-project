const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { createBadge, listBadges, updateBadge, deleteBadge } = require('../controllers/badgeController');

const router = express.Router();

// Protect all routes: only super_admin
router.use(authenticate, authorizeRoles('super_admin'));

router.post('/', createBadge);

router.get('/', listBadges);

router.put('/:id', updateBadge);

router.delete('/:id', deleteBadge);

module.exports = router;
