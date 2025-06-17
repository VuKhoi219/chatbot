const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController');
// const authMiddleware = require('../middleware/authMiddleware'); // Middleware xác thực JWT

// Route đăng ký
router.post('/register', userController.register);

// Route đăng nhập
router.post('/login', userController.login);

module.exports = router;