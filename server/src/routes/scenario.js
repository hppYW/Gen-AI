import express from 'express';
import scenarioController from '../controllers/scenarioController.js';

const router = express.Router();

// Get all scenarios
router.get('/', scenarioController.getAllScenarios);

// Get scenario by ID
router.get('/:id', scenarioController.getScenario);

// Get scenarios by category
router.get('/category/:category', scenarioController.getByCategory);

// Get scenarios by difficulty
router.get('/difficulty/:difficulty', scenarioController.getByDifficulty);

export default router;
