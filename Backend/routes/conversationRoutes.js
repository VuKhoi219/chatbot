const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
// Routes
router.post('/', conversationController.createConversation);

// GET /api/conversations/user/:userId - Lấy tất cả conversations của user
router.get('/user/:userId', conversationController.getConversationsByUserId);

module.exports = router;