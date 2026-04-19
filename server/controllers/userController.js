import User from '../models/User.js';
import bcrypt from 'bcrypt';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password'
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // 3. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 5. Remove password from response
    user.password = undefined;

    // 6. Send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (will be protected later with auth)
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding password field
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public (will be protected later)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID, excluding password
    const user = await User.findById(id).select('-password');

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (will add auth later)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Save updated user
    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (will add auth later)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};