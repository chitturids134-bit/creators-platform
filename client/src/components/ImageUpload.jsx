import React, { useState, useEffect } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select an image file (JPEG, PNG, WebP, or GIF)';
    }

    if (file.size > maxSizeInBytes) {
      return `File is too large. Maximum size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    return null; // null means no error
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // If user cancels the picker without selecting, files[0] will be undefined
    if (!file) return;

    // Clear previous errors
    setError('');

    // Validate the file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Set the file and generate a preview
    setSelectedFile(file);

    // Revoke previous preview URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    // Create FormData and append the file
    const formData = new FormData();
    formData.append('image', selectedFile); // 'image' must match upload.single('image') on the backend

    // Pass formData up to the parent component via the onUpload prop
    // The parent will handle the actual API call
    if (onUpload) {
      onUpload(formData);
    }
  };

  useEffect(() => {
    // This runs when previewUrl changes or the component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <form onSubmit={handleSubmit} className="image-upload-form">

        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange}/>

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {previewUrl && (
          <div>
            <p>Preview:</p>
            <img
              src={previewUrl}
              alt="Selected file preview"
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
          </div>
        )}

        <button type="submit" disabled={!selectedFile || !!error}>
          Upload Image
        </button>
      </form>
    </>
  );
};

export default ImageUpload;