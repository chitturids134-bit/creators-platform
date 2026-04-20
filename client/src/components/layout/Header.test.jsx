import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

import { useAuth } from '../../context/AuthContext';

describe('Header Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows Login and Register when not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: () => false,
      logout: jest.fn()
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).toBeNull();
  });

  it('shows Dashboard, username and Logout when authenticated, and calls logout on click', () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { name: 'Test User' },
      isAuthenticated: () => true,
      logout: mockLogout
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/hi, test user/i)).toBeInTheDocument();

    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });
});