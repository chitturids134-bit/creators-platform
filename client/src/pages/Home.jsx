import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1 style={titleStyle}>Creator's Platform</h1>
        <p style={subtitleStyle}>
          {/* Brief description of what your platform does */}
        </p>
        <div style={ctaStyle}>
          <Link to="/register" style={buttonStyle}>
            Get Started
          </Link>
          <Link to="/login" style={secondaryButtonStyle}>
            Login
          </Link>
        </div>
      </div>

      {/* Features Section (Optional) */}
      <div style={featuresStyle}>
        <h2>Why Choose {/* Platform Name */}?</h2>
        <div style={featureGridStyle}>
          {/* Add 3 feature cards based on your theme */}
          <div style={featureCardStyle}>
            <h3>Feature 1</h3>
            <p>Description</p>
          </div>
          <div style={featureCardStyle}>
            <h3>Feature 2</h3>
            <p>Description</p>
          </div>
          <div style={featureCardStyle}>
            <h3>Feature 3</h3>
            <p>Description</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
};

const heroStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  backgroundColor: '#f5f5f5',
};

const titleStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
  color: '#333',
};

const subtitleStyle = {
  fontSize: '1.25rem',
  color: '#666',
  marginBottom: '2rem',
};

const ctaStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '0.75rem 2rem',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const secondaryButtonStyle = {
  backgroundColor: 'white',
  color: '#007bff',
  padding: '0.75rem 2rem',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
  border: '2px solid #007bff',
};

const featuresStyle = {
  padding: '4rem 2rem',
  textAlign: 'center',
};

const featureGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  marginTop: '2rem',
  maxWidth: '1200px',
  margin: '2rem auto',
};

const featureCardStyle = {
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export default Home;