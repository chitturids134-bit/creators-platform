import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPost, getPosts } from '../controllers/postController.js';

const router = express.Router();

// Both routes require authentication
router.post('/', protect, createPost);
router.get('/', protect, getPosts);

export default router;