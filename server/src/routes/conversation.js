import express from 'express';
import conversationController from '../controllers/conversationController.js';

const router = express.Router();

// Start a new conversation
router.post('/start', conversationController.startConversation);

// Send a message
router.post('/message', conversationController.sendMessage);

// Get suggested responses
router.post('/suggestions', conversationController.getSuggestions);

// Analyze conversation
router.post('/analyze', conversationController.analyzeConversation);

export default router;
