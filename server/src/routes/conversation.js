import express from 'express';
import conversationController from '../controllers/conversationController.js';

const router = express.Router();

// Start a new conversation
router.post('/start', conversationController.startConversation);

// Send a message
router.post('/message', conversationController.sendMessage);

// Analyze conversation
router.post('/analyze', conversationController.analyzeConversation);

export default router;
