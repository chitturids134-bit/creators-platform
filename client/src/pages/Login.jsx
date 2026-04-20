import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth(); // Get login function
  // Form field state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // UI states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  // Handlers will go here
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setApiError('');

    const {email, password} = formData;

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Send login request
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      const data = response.data;

      if (response.status >= 200 && response.status < 300) {
        // Login successful
        
        login(data.user, data.token); // Use context function

        // 4. Redirect to dashboard
        navigate('/dashboard');

      } else {
        // Login failed
        setApiError(data.message || 'Login failed. Please try again.');
      }

      toast.success('Login successful!');

    } catch (error) {
      console.error('Login error:', error);
      setApiError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>
          Login to your {/* Your Platform Name */} account
        </p>

        {/* API Error Message */}
        {apiError && (
          <div style={errorMessageStyle}>
            {apiError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          
          {/* Email Field */}
          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={errors.email ? inputErrorStyle : inputStyle}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <span style={errorTextStyle}>{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={errors.password ? inputErrorStyle : inputStyle}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span style={errorTextStyle}>{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={isLoading ? buttonDisabledStyle : buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Link */}
        <p style={linkTextStyle}>
          Don't have an account?{' '}
          <Link to="/register" style={linkStyle}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#f8f9fa',
};

const formContainerStyle = {
  maxWidth: '400px',
  width: '100%',
  padding: '2.5rem',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '0.5rem',
  color: '#333',
  fontSize: '2rem',
};

const subtitleStyle = {
  textAlign: 'center',
  color: '#666',
  marginBottom: '2rem',
  fontSize: '0.95rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: '#333',
  fontSize: '0.9rem',
};

const inputStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '5px',
};

const inputErrorStyle = {
  ...inputStyle,
  borderColor: '#dc3545',
};

const errorTextStyle = {
  color: '#dc3545',
  fontSize: '0.85rem',
  marginTop: '0.25rem',
};

const buttonStyle = {
  padding: '0.875rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
  cursor: 'not-allowed',
};

const errorMessageStyle = {
  padding: '1rem',
  backgroundColor: '#f8d7da',
  color: '#721c24',
  borderRadius: '5px',
  marginBottom: '1rem',
  border: '1px solid #f5c6cb',
};

const linkTextStyle = {
  textAlign: 'center',
  marginTop: '1.5rem',
  color: '#666',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: '500',
};

export default Login;