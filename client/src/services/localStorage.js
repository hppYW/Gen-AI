const STORAGE_KEY = 'negotiation_conversations';

class LocalStorageService {
  /**
   * Save a conversation to localStorage
   */
  saveConversation(conversationData) {
    try {
      const conversations = this.getAllConversations();

      const newConversation = {
        id: conversationData.conversationId || `conv_${Date.now()}`,
        conversationId: conversationData.conversationId,
        scenarioId: conversationData.scenarioId,
        scenarioTitle: conversationData.scenarioTitle,
        messages: conversationData.messages,
        analysis: conversationData.analysis,
        finalScore: conversationData.finalScore,
        messageCount: conversationData.messages.length,
        duration: conversationData.duration,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to beginning of array (most recent first)
      conversations.unshift(newConversation);

      // Keep only the last 50 conversations to avoid storage limits
      const limitedConversations = conversations.slice(0, 50);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedConversations));

      return newConversation;
    } catch (error) {
      console.error('Failed to save conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations from localStorage
   */
  getAllConversations() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get conversations:', error);
      return [];
    }
  }

  /**
   * Get conversation by ID
   */
  getConversation(conversationId) {
    try {
      const conversations = this.getAllConversations();
      return conversations.find(conv => conv.conversationId === conversationId);
    } catch (error) {
      console.error('Failed to get conversation:', error);
      return null;
    }
  }

  /**
   * Delete a conversation
   */
  deleteConversation(conversationId) {
    try {
      const conversations = this.getAllConversations();
      const filtered = conversations.filter(conv => conv.conversationId !== conversationId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      return false;
    }
  }

  /**
   * Clear all conversations
   */
  clearAllConversations() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear conversations:', error);
      return false;
    }
  }

  /**
   * Get user statistics
   */
  getStats() {
    try {
      const conversations = this.getAllConversations();

      if (conversations.length === 0) {
        return {
          totalConversations: 0,
          totalMessages: 0,
          averageScore: 0,
          lastActivity: null,
        };
      }

      const totalConversations = conversations.length;
      const totalMessages = conversations.reduce((sum, conv) => sum + (conv.messageCount || 0), 0);
      const averageScore = conversations.reduce((sum, conv) => sum + (conv.finalScore || 0), 0) / totalConversations;

      return {
        totalConversations,
        totalMessages,
        averageScore: Math.round(averageScore),
        lastActivity: conversations[0]?.createdAt || null,
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return {
        totalConversations: 0,
        totalMessages: 0,
        averageScore: 0,
        lastActivity: null,
      };
    }
  }
}

export default new LocalStorageService();
