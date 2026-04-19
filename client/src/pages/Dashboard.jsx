import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Welcome, {user.name}!</h1>
        <button onClick={logout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>

      <div style={contentStyle}>
        <div style={cardStyle}>
          <h2>Your Account</h2>
          <div style={infoStyle}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={cardStyle}>
          <h2>Dashboard Features</h2>
          <p>This is your personalized dashboard. Future features will include:</p>
          <ul>
            <li>Create and manage your content</li>
            <li>View your statistics</li>
            <li>Edit your profile</li>
            <li>See your activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '80vh',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const logoutButtonStyle = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: '500',
};

const contentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
};

const cardStyle = {
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const infoStyle = {
  marginTop: '1rem',
  lineHeight: '2',
};

export default Dashboard;