import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExpenseForm from '../Expenses/ExpenseForm';

describe('ExpenseForm Component', () => {
  const categories = [
    { id: 1, title: 'Food', color: '#00C49A' },
    { id: 2, title: 'Transport', color: '#156064' }
  ];

  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in add mode', () => {
    render(
      <ExpenseForm
        categories={categories}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('heading', { name: /Add Expense/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Lunch at Café')).toBeInTheDocument();
    expect(screen.getByText(/^Label/i, { selector: 'label' })).toBeInTheDocument();
    expect(screen.getByText(/^Amount/i, { selector: 'label' })).toBeInTheDocument();
    expect(screen.getByText(/^Category/i, { selector: 'label' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Expense' })).toBeInTheDocument();
  });

  it('renders correctly in edit mode', () => {
    const expense = {
      id: 123,
      label: 'Dinner',
      amount: 45.5,
      date: '2025-04-26',
      categoryId: 1
    };

    render(
      <ExpenseForm
        expense={expense}
        categories={categories}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Expense')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dinner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('45.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-04-26')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    render(
      <ExpenseForm
        categories={categories}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const submitBtn = screen.getByRole('button', { name: 'Add Expense' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Label is required')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid amount')).toBeInTheDocument();
    expect(screen.getByText('Select a category')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onSave with valid data', async () => {
    render(
      <ExpenseForm
        categories={categories}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Lunch at Café'), { target: { value: 'New Shoes' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '99.99' } });
    fireEvent.change(screen.getByDisplayValue(/— Select —/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: 'Add Expense' }));
    await waitFor(() => expect(mockOnSave).toHaveBeenCalled());

    console.log(mockOnSave.mock.calls[0][0]); // affiche l'objet réel reçu
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ExpenseForm
        categories={categories}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows category preview when selected', () => {
    render(
      <ExpenseForm
        categories={categories}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByDisplayValue(/— Select —/i), { target: { value: '1' } });
    expect(screen.getByText('Food')).toBeInTheDocument();
  });
});