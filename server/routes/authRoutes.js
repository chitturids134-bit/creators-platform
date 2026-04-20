const express = require('express');
const { loginUser } = require('../controllers/authController');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Registration route (also available under /api/users/register)
router.post('/register', registerUser);

module.exports = router;
