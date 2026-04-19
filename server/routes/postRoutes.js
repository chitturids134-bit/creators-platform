import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPost, getPosts, deletePost, getPostById, updatePost } from '../controllers/postController.js';

const router = express.Router();

// Both routes require authentication
router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.delete('/:id', protect, deletePost);
router.get('/:id', protect, getPostById);
router.put('/:id', protect, updatePost);

export default router;