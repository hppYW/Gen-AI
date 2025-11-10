import express from 'express';
import conversationController from '../controllers/conversationController.js';
import { optionalAuth, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Start a new conversation (optional auth)
router.post('/start', optionalAuth, conversationController.startConversation);

// Send a message (optional auth)
router.post('/message', optionalAuth, conversationController.sendMessage);

// Analyze conversation (optional auth)
router.post('/analyze', optionalAuth, conversationController.analyzeConversation);

// Save conversation (requires auth)
router.post('/save', verifyToken, conversationController.saveConversation);

// Get user's conversations (requires auth)
router.get('/history', verifyToken, conversationController.getConversationHistory);

export default router;
