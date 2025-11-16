import claudeService from '../services/claudeService.js';
import { getScenarioById } from '../models/scenarios.js';
import { calculateStarRating } from '../models/achievements.js';

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
        emotionState: initialMessage.emotionState,
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

      // Generate AI response with integrated analysis (single API call)
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

      // Calculate star rating
      const starRating = calculateStarRating(aiResponse.analysis, aiResponse.emotionState);

      console.log('✅ AI Response generated:', {
        messageLength: aiResponse.message.length,
        emotion: aiResponse.emotionState.emotion,
        rapport: aiResponse.emotionState.rapport
      });

      res.json({
        conversationId,
        aiMessage: aiResponse.message,
        analysis: aiResponse.analysis,
        emotionState: aiResponse.emotionState,
        starRating,
        messageFeedback: aiResponse.messageFeedback,
        conversationHistory: updatedHistory,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  /**
   * Get suggested responses for the user
   */
  async getSuggestions(req, res) {
    try {
      const { conversationHistory, scenarioId } = req.body;

      console.log('📥 getSuggestions called:', {
        scenarioId,
        historyLength: conversationHistory ? conversationHistory.length : 0,
        userMessages: conversationHistory ? conversationHistory.filter(m => m.role === 'user').length : 0
      });

      if (!scenarioId) {
        return res.status(400).json({ error: 'scenarioId is required' });
      }

      const scenario = getScenarioById(scenarioId);
      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }

      const suggestions = await claudeService.generateSuggestions(
        conversationHistory || [],
        scenario,
        scenario.npcProfile
      );

      console.log('📤 Returning suggestions:', suggestions.suggestions?.length || 0, 'items');

      res.json({
        suggestions: suggestions.suggestions || [],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get suggestions error:', error);
      res.status(500).json({ error: 'Failed to get suggestions' });
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
}

export default new ConversationController();
