const express = require('express');
const { protect } = require('../middleware/auth');
const {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Public route - no protection
router.post('/register', registerUser);

// Protected routes - require authentication
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
