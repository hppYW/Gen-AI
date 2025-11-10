import claudeService from '../services/claudeService.js';
import firestoreService from '../services/firestoreService.js';
import { getScenarioById } from '../models/scenarios.js';

class ConversationController {
  /**
   * Start a new negotiation conversation
   */
  async startConversation(req, res) {
    try {
      const { scenarioId } = req.body;

      const scenario = getScenarioById(scenarioId);
      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }

      // Initialize conversation with AI greeting
      const initialMessage = await claudeService.generateResponse(
        [],
        scenario,
        scenario.npcProfile
      );

      res.json({
        conversationId: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        scenario,
        initialMessage: initialMessage.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Start conversation error:', error);
      res.status(500).json({ error: 'Failed to start conversation' });
    }
  }

  /**
   * Send a message in the conversation
   */
  async sendMessage(req, res) {
    try {
      const { conversationId, message, conversationHistory, scenarioId } = req.body;

      if (!message || !scenarioId) {
        return res.status(400).json({ error: 'Message and scenarioId are required' });
      }

      const scenario = getScenarioById(scenarioId);
      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }

      // Add user message to history
      const updatedHistory = [
        ...(conversationHistory || []),
        { role: 'user', content: message }
      ];

      // Generate AI response
      const aiResponse = await claudeService.generateResponse(
        updatedHistory,
        scenario,
        scenario.npcProfile
      );

      // Add AI response to history
      updatedHistory.push({
        role: 'assistant',
        content: aiResponse.message
      });

      res.json({
        conversationId,
        aiMessage: aiResponse.message,
        analysis: aiResponse.analysis,
        conversationHistory: updatedHistory,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  /**
   * Get conversation analysis
   */
  async analyzeConversation(req, res) {
    try {
      const { conversationHistory, scenarioId } = req.body;

      if (!conversationHistory || conversationHistory.length === 0) {
        return res.status(400).json({ error: 'Conversation history is required' });
      }

      const scenario = getScenarioById(scenarioId);
      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }

      const lastMessage = conversationHistory[conversationHistory.length - 1];
      const analysis = await claudeService.analyzeNegotiation(
        conversationHistory,
        lastMessage.content
      );

      res.json({
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analyze conversation error:', error);
      res.status(500).json({ error: 'Failed to analyze conversation' });
    }
  }

  /**
   * Save conversation to Firestore
   */
  async saveConversation(req, res) {
    try {
      const {
        conversationId,
        scenarioId,
        scenarioTitle,
        messages,
        analysis,
        finalScore,
        duration,
      } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const conversationData = {
        conversationId,
        scenarioId,
        scenarioTitle,
        messages,
        analysis,
        finalScore,
        duration,
      };

      const saved = await firestoreService.saveConversation(
        req.user.uid,
        conversationData
      );

      res.json({
        success: true,
        conversation: saved,
      });
    } catch (error) {
      console.error('Save conversation error:', error);
      res.status(500).json({ error: 'Failed to save conversation' });
    }
  }

  /**
   * Get user's conversation history
   */
  async getConversationHistory(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const limit = parseInt(req.query.limit) || 20;
      const conversations = await firestoreService.getUserConversations(
        req.user.uid,
        limit
      );

      res.json({
        conversations,
        total: conversations.length,
      });
    } catch (error) {
      console.error('Get conversation history error:', error);
      res.status(500).json({ error: 'Failed to get conversation history' });
    }
  }
}

export default new ConversationController();
