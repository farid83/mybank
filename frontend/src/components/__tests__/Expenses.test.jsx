import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Expenses from '../Expenses/Expenses';

describe('Expenses Component', () => {
  const categories = [
    { id: 1, title: 'Food', color: '#00C49A' },
    { id: 2, title: 'Transport', color: '#156064' }
  ];

  const expenses = [
    { id: 101, label: 'Coffee', amount: 5.5, date: '2025-04-26', categoryId: 1 },
    { id: 102, label: 'Bus', amount: 2.5, date: '2025-04-25', categoryId: 2 },
    { id: 103, label: 'Dinner', amount: 25.0, date: '2025-04-24', categoryId: 1 }
  ];

  

  const mockOnAdd = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with list of expenses', () => {
    render(
      <Expenses 
        expenses={expenses} 
        categories={categories} 
        onAddExpense={mockOnAdd}
        onEditExpense={mockOnEdit}
        onDeleteExpense={mockOnDelete}
      />
    );

    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Bus')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText(/3 of 3 transactions/i)).toBeInTheDocument();
  });

  it('filters expenses by search term', () => {
    render(
      <Expenses 
        expenses={expenses} 
        categories={categories} 
        onAddExpense={mockOnAdd}
        onEditExpense={mockOnEdit}
        onDeleteExpense={mockOnDelete}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search expenses/i);
    fireEvent.change(searchInput, { target: { value: 'off' } }); // Search for Coffee (contains 'off')

    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.queryByText('Bus')).not.toBeInTheDocument();
    expect(screen.queryByText('Dinner')).not.toBeInTheDocument();
  });

  it('filters expenses by category', async () => {
    render(
      <Expenses 
        expenses={expenses} 
        categories={categories} 
        onAddExpense={mockOnAdd}
        onEditExpense={mockOnEdit}
        onDeleteExpense={mockOnDelete}
      />
    );

    const categorySelect = screen.getByDisplayValue(/All categories/i);
    fireEvent.change(categorySelect, { target: { value: '2' } }); 

    await waitFor(() => {
      expect(screen.getByText('Bus')).toBeInTheDocument();
      expect(screen.queryByText('Coffee')).not.toBeInTheDocument();
      expect(screen.queryByText('Dinner')).not.toBeInTheDocument();
    });
  });

  it('sorts expenses by amount', () => {
    render(
      <Expenses 
        expenses={expenses} 
        categories={categories} 
        onAddExpense={mockOnAdd}
        onEditExpense={mockOnEdit}
        onDeleteExpense={mockOnDelete}
      />
    );

    const sortBySelect = screen.getByDisplayValue(/Newest First/i);
    fireEvent.change(sortBySelect, { target: { value: 'amount-desc' } });

    const allAmounts = screen.getAllByText(/\$/).map(el => el.textContent);
    // Skip "FILTERED TOTAL" and "AVG. TRANSACTION" cards
    const expenseElements = allAmounts.filter(text => !text.includes('Total') && !text.includes('Avg'));
    // If that's not enough, slice specifically
    const listAmounts = allAmounts.slice(2);
    
    expect(listAmounts[0]).toContain('25.00');
    expect(listAmounts[1]).toContain('5.50');
    expect(listAmounts[2]).toContain('2.50');
  });

  it('calls onAddExpense when clicking Add button', () => {
    render(
      <Expenses 
        expenses={expenses} 
        categories={categories} 
        onAddExpense={mockOnAdd}
        onEditExpense={mockOnEdit}
        onDeleteExpense={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add Expense' }));
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('calls onEditExpense when clicking Edit button', () => {
    render(
      <Expenses 
        expenses={expenses} 
        categories={categories} 
        onAddExpense={mockOnAdd}
        onEditExpense={mockOnEdit}
        onDeleteExpense={mockOnDelete}
      />
    );

    // Get all edit buttons (using title)
    const editButtons = screen.getAllByTitle('Edit');
    
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(expenses[0]);
  });

  it('calls onDeleteExpense when clicking Delete button', () => {
    render(
      <Expenses 
        expenses={expenses} 
        categories={categories} 
        onAddExpense={mockOnAdd}
        onEditExpense={mockOnEdit}
        onDeleteExpense={mockOnDelete}
      />
    );

    // Get all delete buttons (using title)
    const deleteButtons = screen.getAllByTitle('Delete');
    
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(expenses[0]);
  });

  it('shows summary of totals', () => {
    render(
      <Expenses 
        expenses={expenses} 
        categories={categories} 
        onAddExpense={mockOnAdd}
        onEditExpense={mockOnEdit}
        onDeleteExpense={mockOnDelete}
      />
    );

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    expect(screen.getByText(new RegExp(totalAmount.toString()))).toBeInTheDocument();
  });
});
