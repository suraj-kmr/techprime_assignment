const express = require('express');
const { createProject, getProjects, updateProject, getCardValues, getDepartmentSuccessRates } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getProjects);
router.put('/:id', authMiddleware, updateProject);
router.get('/card-values', authMiddleware, getCardValues);
router.get('/success-rates', authMiddleware, getDepartmentSuccessRates);

module.exports = router;
