import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('shows validation errors on empty submit (role=alert present)', async () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Since we added role="alert" to validation spans, we can assert alerts exist
    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('typing test: inputs accept user input', async () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'tester@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('tester@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('happy path: submits form and calls API with correct payload once', async () => {
    const mockLogin = jest.fn();
    useAuth.mockReturnValue({ login: mockLogin });

    const fakeUser = { id: '1', name: 'Tester', email: 't@test.com' };
    api.post.mockResolvedValue({ status: 200, data: { user: fakeUser, token: 'tok' } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 't@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitBtn);

    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 't@test.com',
      password: 'password123'
    });
  });

  it('validation failure path: submit without filling fields shows alert and does not call API', async () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /login/i });

    await user.click(submitBtn);

    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(api.post).not.toHaveBeenCalled();
  });
});
