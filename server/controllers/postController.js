const Post = require('../models/Post');
const ApiError = require('../utils/ApiError');
const { getIO } = require('../utils/socket');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, status, coverImage } = req.body;

    // Validate required fields
    if (!title || !content) {
      throw new ApiError(400, 'Please provide title and content');
    }

    // Create post with authenticated user as author
    const post = await Post.create({
      title,
      content,
      category,
      status,
      coverImage,
      author: req.user._id // From protect middleware
    });

    // Emit real-time event to connected clients about the new post
    try {
      const io = getIO();
      if (io) {
        io.emit('newPost', {
          message: `New post created by ${req.user?.name ?? 'someone'}`,
          post: {
            id: post._id,
            title: post.title,
            author: req.user?.name ?? ''
          }
        });
      }
    } catch (emitErr) {
      console.error('Error emitting newPost event:', emitErr);
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error) {
    console.error('Create post error:', error);
    next(error);
  }
};

// @desc    Get posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Private
const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 20, 1);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .select('title content author createdAt coverImage')
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments()
    ]);

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    // Check ownership - CRITICAL SECURITY CHECK
    if (post.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to delete this post');
    }

    // Delete the post
    await post.deleteOne();

    // Emit deletion event to clients
    try {
      const io = getIO();
      if (io) {
        io.emit('deletePost', {
          message: `A post was deleted`,
          id: req.params.id
        });
      }
    } catch (emitErr) {
      console.error('Error emitting deletePost event:', emitErr);
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id }
    });

  } catch (error) {
    console.error('Delete post error:', error);
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    // Check ownership - CRITICAL SECURITY CHECK
    if (post.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to update this post');
    }

    // Update fields
    const { title, content, category, status, coverImage } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (status) post.status = status;

    // Allow clearing the coverImage when the client explicitly provides null or empty string
    if (Object.prototype.hasOwnProperty.call(req.body, 'coverImage')) {
      post.coverImage = coverImage || null;
    }

    // Save updated post
    const updatedPost = await post.save();

    // Emit update event to clients
    try {
      const io = getIO();
      if (io) {
        io.emit('updatePost', {
          message: `Post updated by ${req.user?.name ?? 'someone'}`,
          post: {
            id: updatedPost._id,
            title: updatedPost.title
          }
        });
      }
    } catch (emitErr) {
      console.error('Error emitting updatePost event:', emitErr);
    }

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar')
      .lean();

    if (!post) {
      return next(new ApiError(404, 'Post not found'));
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error('Get post by id error:', error);
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  getPostById
};
