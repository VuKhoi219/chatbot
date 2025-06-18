const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /chat/title
router.post('/title', chatController.generateTitle);

// POST /chat/message
router.post('/message', chatController.chat);

module.exports = router;
