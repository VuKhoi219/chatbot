const express = require('express');
const MessageController = require('../controllers/messageController');

const router = express.Router();
// POST /api/messages - Tạo tin nhắn mới
router.post('/', MessageController.createMessage);

// GET /api/messages/conversation/:conversationId - Lấy tin nhắn theo conversation_id
router.get('/conversation/:conversationId', MessageController.getMessagesByConversationId);


module.exports = router;