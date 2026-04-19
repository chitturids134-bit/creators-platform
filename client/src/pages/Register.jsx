import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>Join {/* Your Platform Name */} today</p>
        
        {/* Placeholder for registration form */}
        <div style={placeholderStyle}>
          <p>Registration form will be implemented in a future lesson</p>
          <p>This will include:</p>
          <ul style={listStyle}>
            <li>Name input field</li>
            <li>Email input field</li>
            <li>Password input field</li>
            <li>Confirm password field</li>
            <li>Registration button</li>
            <li>Form validation</li>
          </ul>
        </div>

        <p style={linkTextStyle}>
          Already have an account?{' '}
          <Link to="/login" style={linkStyle}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

// Use the same styles as Login page
const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};

const formContainerStyle = {
  maxWidth: '400px',
  width: '100%',
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '0.5rem',
  color: '#333',
};

const subtitleStyle = {
  textAlign: 'center',
  color: '#666',
  marginBottom: '2rem',
};

const placeholderStyle = {
  backgroundColor: '#f8f9fa',
  padding: '1.5rem',
  borderRadius: '5px',
  marginBottom: '1rem',
};

const listStyle = {
  paddingLeft: '1.5rem',
  marginTop: '1rem',
};

const linkTextStyle = {
  textAlign: 'center',
  marginTop: '1rem',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: 'bold',
};

export default Register;