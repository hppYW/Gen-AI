import { scenarios, getScenarioById, getScenariosByCategory, getScenariosByDifficulty } from '../models/scenarios.js';

class ScenarioController {
  /**
   * Get all scenarios
   */
  getAllScenarios(req, res) {
    try {
      res.json({
        scenarios,
        total: scenarios.length
      });
    } catch (error) {
      console.error('Get scenarios error:', error);
      res.status(500).json({ error: 'Failed to get scenarios' });
    }
  }

  /**
   * Get scenario by ID
   */
  getScenario(req, res) {
    try {
      const { id } = req.params;
      const scenario = getScenarioById(id);

      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }

      res.json({ scenario });
    } catch (error) {
      console.error('Get scenario error:', error);
      res.status(500).json({ error: 'Failed to get scenario' });
    }
  }

  /**
   * Get scenarios by category
   */
  getByCategory(req, res) {
    try {
      const { category } = req.params;
      const scenarios = getScenariosByCategory(category);

      res.json({
        scenarios,
        category,
        total: scenarios.length
      });
    } catch (error) {
      console.error('Get scenarios by category error:', error);
      res.status(500).json({ error: 'Failed to get scenarios' });
    }
  }

  /**
   * Get scenarios by difficulty
   */
  getByDifficulty(req, res) {
    try {
      const { difficulty } = req.params;
      const scenarios = getScenariosByDifficulty(difficulty);

      res.json({
        scenarios,
        difficulty,
        total: scenarios.length
      });
    } catch (error) {
      console.error('Get scenarios by difficulty error:', error);
      res.status(500).json({ error: 'Failed to get scenarios' });
    }
  }
}

export default new ScenarioController();
