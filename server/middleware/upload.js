import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880 // 5MB in bytes
  },
  fileFilter: (req, file, cb) => {
    // file.mimetype will be something like 'image/jpeg' or 'image/png'
    // cb(null, true) = accept the file
    // cb(null, false) = reject the file
    // cb(new Error('message')) = reject with an error

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export default upload;