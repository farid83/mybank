import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';

// ARRANGE
describe('Login Component', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders the login form with all required elements', () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    // ASSERT
    expect(screen.getByText('Welcome back 👋')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('displays the logo and branding correctly', () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    // ASSERT
    expect(screen.getByText('myBank')).toBeInTheDocument();
    expect(screen.getByText('PERSONAL FINANCE')).toBeInTheDocument();
    expect(screen.getByText((content) => {
      return content.includes('Take control of your money.') && content.includes('Track every expense, understand your habits.');
    })).toBeInTheDocument();
  });

  it('shows error message when submitting empty form', async () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('shows error message when submitting with only email', async () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('shows error message when submitting with only password', async () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('calls onLogin when form is submitted with valid data', async () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    // ASSERT
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });

  it('shows loading state during login process', async () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    // ASSERT
    expect(screen.getByText('Signing in…')).toBeInTheDocument();
    expect(signInButton).toBeDisabled();

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });

  it('toggles password visibility', () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const toggleButton = passwordInput.parentElement.querySelector('button');

    // Initially password is hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('clears error message on successful login', () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // Error should be shown
    expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit again with valid data
    fireEvent.click(signInButton);

    // ASSERT - Error should be cleared on successful submission
    expect(screen.queryByText('Please fill in all fields.')).not.toBeInTheDocument();
  });

  it('displays demo hint', () => {
    // ACT
    render(<Login onLogin={mockOnLogin} />);

    // ASSERT
    expect(screen.getByText(/Demo:/)).toBeInTheDocument();
    expect(screen.getByText('Enter any email & password to log in.')).toBeInTheDocument();
  });
});