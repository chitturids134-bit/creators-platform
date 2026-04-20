import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'creator-platform' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

router.post('/', protect, upload.single('image'), async (req, res) => {
  // 1. Check if a file was actually sent
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // 2. Upload the buffer to Cloudinary
  // Use your uploadToCloudinary helper here
  // Hint: pass req.file.buffer
  let cloudinaryResult;
  try {
    cloudinaryResult = await uploadToCloudinary(req.file.buffer);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return res.status(500).json({ success: false, message: 'Error uploading image' });
  }

  // 3. Return the secure_url
  // Cloudinary's response contains many fields.
  // You only need: result.secure_url and result.public_id
  res.json({ success: true, url: cloudinaryResult.secure_url, public_id: cloudinaryResult.public_id });
});

// Multer error handler (must have 4 parameters to be treated as error middleware)
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Maximum size is 5MB.'
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message || 'File upload error'
  });
});

export default router;