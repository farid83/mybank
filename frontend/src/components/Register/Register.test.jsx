import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from './Register';
import { api } from '../../services/api';

vi.mock('../../services/api', () => ({
  api: {
    register: vi.fn(),
  }
}));

describe('Register Component', () => {
  const mockOnRegister = vi.fn();
  const mockOnSwitchToLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    api.register.mockResolvedValue({ message: 'Success' });
  });

  it('renders the register form with all required elements', () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    expect(screen.getByText('Create Account', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/john@example\.com/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/••••••••/i)).toHaveLength(2); // Password and Confirm
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays branding and feature highlights', () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    expect(screen.getByText('Join myBank')).toBeInTheDocument();
    expect(screen.getByText('No hidden fees')).toBeInTheDocument();
    expect(screen.getByText('Smart Analytics')).toBeInTheDocument();
    expect(screen.getByText('Top-tier Security')).toBeInTheDocument();
  });

  it('shows error message when submitting empty form', async () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    expect(mockOnRegister).not.toHaveBeenCalled();
  });

  it('shows error message when passwords do not match', async () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'John Smith' } });
    fireEvent.change(screen.getByPlaceholderText(/john@example\.com/i), { target: { value: 'john@smith.com' } });
    
    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password456' } });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(mockOnRegister).not.toHaveBeenCalled();
  });

  it('shows error message for short password', async () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'John Smith' } });
    fireEvent.change(screen.getByPlaceholderText(/john@example\.com/i), { target: { value: 'john@smith.com' } });
    
    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInputs[0], { target: { value: '123' } });
    fireEvent.change(passwordInputs[1], { target: { value: '123' } });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
    expect(mockOnRegister).not.toHaveBeenCalled();
  });

  it('calls onSwitchToLogin when sign in button is clicked', () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1);
  });

  it('toggles password visibility', () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    const toggleButton = screen.getByText(/show passwords/i);

    // Initial state
    expect(passwordInputs[0]).toHaveAttribute('type', 'password');
    expect(passwordInputs[1]).toHaveAttribute('type', 'password');

    // Click to show
    fireEvent.click(toggleButton);
    expect(screen.getByText(/hide passwords/i)).toBeInTheDocument();
    expect(passwordInputs[0]).toHaveAttribute('type', 'text');
    expect(passwordInputs[1]).toHaveAttribute('type', 'text');

    // Click to hide
    fireEvent.click(screen.getByText(/hide passwords/i));
    expect(screen.getByText(/show passwords/i)).toBeInTheDocument();
    expect(passwordInputs[0]).toHaveAttribute('type', 'password');
    expect(passwordInputs[1]).toHaveAttribute('type', 'password');
  });

  it('shows loading state and calls onRegister with valid data', async () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/john@example\.com/i), { target: { value: 'jane@example.com' } });
    
    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    // ASSERT
    expect(screen.getByText(/creating account…/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith('Jane Doe', 'jane@example.com', 'password123');
      expect(mockOnRegister).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        email: 'jane@example.com'
      });
    });
  });

  it('clears error message when input is corrected and resubmitted', async () => {
    render(<Register onRegister={mockOnRegister} onSwitchToLogin={mockOnSwitchToLogin} />);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    // Error shown
    expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();

    // Correcting inputs
    fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/john@example\.com/i), { target: { value: 'jane@example.com' } });
    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Please fill in all fields.')).not.toBeInTheDocument();
    });
  });
});
