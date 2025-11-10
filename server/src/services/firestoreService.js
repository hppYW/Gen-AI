import admin from 'firebase-admin';

class FirestoreService {
  constructor() {
    this.db = null;
    this.initialized = false;

    try {
      this.db = admin.firestore();
      this.initialized = true;
    } catch (error) {
      console.warn('Firestore not initialized:', error.message);
    }
  }

  /**
   * Save conversation to Firestore
   */
  async saveConversation(userId, conversationData) {
    if (!this.initialized) {
      console.warn('Firestore not initialized - skipping save');
      return null;
    }

    try {
      const conversationRef = this.db.collection('conversations').doc();

      const data = {
        userId,
        conversationId: conversationData.conversationId,
        scenarioId: conversationData.scenarioId,
        scenarioTitle: conversationData.scenarioTitle,
        messages: conversationData.messages,
        analysis: conversationData.analysis,
        finalScore: conversationData.finalScore,
        messageCount: conversationData.messages.length,
        duration: conversationData.duration,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await conversationRef.set(data);

      return {
        id: conversationRef.id,
        ...data,
      };
    } catch (error) {
      console.error('Failed to save conversation:', error);
      throw error;
    }
  }

  /**
   * Get user's conversations
   */
  async getUserConversations(userId, limit = 20) {
    if (!this.initialized) {
      return [];
    }

    try {
      const snapshot = await this.db
        .collection('conversations')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId, userId) {
    if (!this.initialized) {
      return null;
    }

    try {
      const doc = await this.db.collection('conversations').doc(conversationId).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();

      // Verify user owns this conversation
      if (data.userId !== userId) {
        throw new Error('Unauthorized access to conversation');
      }

      return {
        id: doc.id,
        ...data,
      };
    } catch (error) {
      console.error('Failed to get conversation:', error);
      throw error;
    }
  }

  /**
   * Update conversation
   */
  async updateConversation(conversationId, userId, updates) {
    if (!this.initialized) {
      return null;
    }

    try {
      const conversationRef = this.db.collection('conversations').doc(conversationId);
      const doc = await conversationRef.get();

      if (!doc.exists) {
        throw new Error('Conversation not found');
      }

      const data = doc.data();
      if (data.userId !== userId) {
        throw new Error('Unauthorized access to conversation');
      }

      await conversationRef.update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        id: conversationId,
        ...data,
        ...updates,
      };
    } catch (error) {
      console.error('Failed to update conversation:', error);
      throw error;
    }
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId, userId) {
    if (!this.initialized) {
      return false;
    }

    try {
      const conversationRef = this.db.collection('conversations').doc(conversationId);
      const doc = await conversationRef.get();

      if (!doc.exists) {
        throw new Error('Conversation not found');
      }

      const data = doc.data();
      if (data.userId !== userId) {
        throw new Error('Unauthorized access to conversation');
      }

      await conversationRef.delete();
      return true;
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    if (!this.initialized) {
      return null;
    }

    try {
      const snapshot = await this.db
        .collection('conversations')
        .where('userId', '==', userId)
        .get();

      const conversations = snapshot.docs.map((doc) => doc.data());

      const totalConversations = conversations.length;
      const totalMessages = conversations.reduce((sum, conv) => sum + (conv.messageCount || 0), 0);
      const averageScore =
        conversations.reduce((sum, conv) => sum + (conv.finalScore || 0), 0) / totalConversations || 0;

      return {
        totalConversations,
        totalMessages,
        averageScore: Math.round(averageScore),
        lastActivity: conversations[0]?.createdAt || null,
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw error;
    }
  }
}

export default new FirestoreService();
