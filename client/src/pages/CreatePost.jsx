import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = (formData) => {
    // In Lesson 4.7, you'll send this formData to the backend
    // For now, just log it to confirm it works
    console.log('FormData ready:', formData.get('image'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/posts', formData);
      
      if (response.data.success) {
        // Redirect to dashboard after successful creation
        toast.success('Post created successfully');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create post';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1>Create New Post</h1>
        
        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Title */}
          <div style={fieldStyle}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              style={inputStyle}
            />
          </div>

          {/* Content */}
          <div style={fieldStyle}>
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content..."
              rows="10"
              required
              style={textareaStyle}
            />
          </div>

          {/* Category */}
          <div style={fieldStyle}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
            </select>
          </div>

          {/* Status */}
          <div style={fieldStyle}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={buttonStyle}
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
        <ImageUpload onUpload={handleUpload} />
      </div>
    </div>
  );
};

// Styles (inspired by Dashboard.jsx)
const containerStyle = {
  minHeight: '80vh',
  padding: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  maxWidth: '900px',
  margin: '0 auto',
};

const formContainerStyle = {
  width: '100%',
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const inputStyle = {
  padding: '0.6rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #e6e6e6',
  fontSize: '1rem',
  outline: 'none',
};

const textareaStyle = {
  padding: '0.6rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #e6e6e6',
  fontSize: '1rem',
  outline: 'none',
  resize: 'vertical',
};

const buttonStyle = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
  alignSelf: 'flex-start',
  boxShadow: '0 2px 6px rgba(0,123,255,0.12)',
};

const errorStyle = {
  margin: '1rem 0',
  padding: '0.75rem 1rem',
  backgroundColor: '#f8d7da',
  color: '#842029',
  borderRadius: '6px',
  border: '1px solid #f5c2c7',
};

export default CreatePost;