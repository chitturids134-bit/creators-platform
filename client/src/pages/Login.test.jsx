import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';

// Mocks
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));
jest.mock('../services/api', () => ({
  post: jest.fn()
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>
  };
});

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields and submit button', () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('calls login and navigates on successful submit', async () => {
    const mockLogin = jest.fn();
    useAuth.mockReturnValue({ login: mockLogin });

    const fakeUser = { id: '1', name: 'Tester', email: 't@test.com' };
    api.post.mockResolvedValue({ status: 200, data: { user: fakeUser, token: 'tok' } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 't@test.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith(fakeUser, 'tok'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('displays server error message on failed login', async () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    api.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 't@test.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
