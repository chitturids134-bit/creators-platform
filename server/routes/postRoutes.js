const express = require('express');
const { protect } = require('../middleware/auth');
const { createPost, getPosts, deletePost, getPostById, updatePost } = require('../controllers/postController');
const Post = require('../models/Post');

const router = express.Router();

// Both routes require authentication
router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.delete('/:id', protect, deletePost);
router.get('/:id', protect, getPostById);
router.put('/:id', protect, updatePost);

router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
