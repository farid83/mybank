import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';

// ─── ARRANGE GLOBAL ───────────────────────────────────────────────────────────
describe('Dashboard Component', () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  // ─── RENDU INITIAL ──────────────────────────────────────────────────────────
  it('renders the sidebar with branding and navigation items', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    // ASSERT
    expect(screen.getByText('myBank')).toBeInTheDocument();
    expect(screen.getByText('PERSONAL FINANCE')).toBeInTheDocument();
    // Use getAllByText because Dashboard, Expenses and Categories might appear as both nav items and headers
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Expenses').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Categories').length).toBeGreaterThan(0);
  });

  it('renders the dashboard screen by default', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    // ASSERT
    expect(screen.getByText('Good morning 🌤️')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('displays the financial summary cards (TOTAL BALANCE, TOTAL SPENT, TRANSACTIONS)', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    // ASSERT
    expect(screen.getByText('TOTAL BALANCE')).toBeInTheDocument();
    expect(screen.getByText('TOTAL SPENT')).toBeInTheDocument();
    expect(screen.getByText('TRANSACTIONS')).toBeInTheDocument();
  });

  it('displays the INCOME and SPENT sub-labels in the balance card', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    // ASSERT
    expect(screen.getByText('INCOME')).toBeInTheDocument();
    expect(screen.getByText('SPENT')).toBeInTheDocument();
  });

  it('renders the Recent Expenses section with seed data', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    // ASSERT
    expect(screen.getByText('Recent Expenses')).toBeInTheDocument();
    expect(screen.getByText('Lunch at Café')).toBeInTheDocument();
  });

  it('renders the By Category section', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    // ASSERT
    expect(screen.getByText('By Category')).toBeInTheDocument();
    expect(screen.getByText('Spending distribution')).toBeInTheDocument();
  });

  // ─── NAVIGATION ─────────────────────────────────────────────────────────────
  it('navigates to the Expenses screen when clicking "Expenses" in the sidebar', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    const expensesNav = screen.getAllByText('Expenses')[0];
    fireEvent.click(expensesNav);

    // ASSERT
    expect(screen.getByRole('heading', { name: /expenses/i })).toBeInTheDocument();
  });

  it('navigates to the Categories screen when clicking "Categories" in the sidebar', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    const categoriesNav = screen.getAllByText('Categories')[0];
    fireEvent.click(categoriesNav);

    // ASSERT
    expect(screen.getByRole('heading', { name: /categories/i })).toBeInTheDocument();
  });

  it('navigates to the Add Expense screen when clicking "Add Expense" button in sidebar', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    const addExpenseBtn = screen.getAllByRole('button', { name: /add expense/i })[0];
    fireEvent.click(addExpenseBtn);

    // ASSERT
    expect(screen.getByRole('heading', { name: /add expense/i })).toBeInTheDocument();
  });

  it('navigates back to Expenses screen when clicking "See all"', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    const seeAllBtn = screen.getByText(/see all/i);
    fireEvent.click(seeAllBtn);

    // ASSERT
    expect(screen.getByRole('heading', { name: /expenses/i })).toBeInTheDocument();
  });

  // ─── LOGOUT ─────────────────────────────────────────────────────────────────
  it('calls onLogout when clicking "Log out" in the sidebar', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    const logoutBtn = screen.getByTitle('Logout');
    fireEvent.click(logoutBtn);

    // ASSERT
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  // ─── ÉCRAN EXPENSES ─────────────────────────────────────────────────────────
  it('displays the expenses list with seed data on Expenses screen', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Expenses')[0]);

    // ASSERT
    expect(screen.getByText('Metro monthly pass')).toBeInTheDocument();
    expect(screen.getByText('Cinema tickets')).toBeInTheDocument();
    expect(screen.getByText('Grocery run')).toBeInTheDocument();
  });

  it('filters expenses by search input', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Expenses')[0]);

    const searchInput = screen.getByPlaceholderText(/search expenses/i);
    fireEvent.change(searchInput, { target: { value: 'Metro' } });

    // ASSERT
    expect(screen.getByText('Metro monthly pass')).toBeInTheDocument();
    expect(screen.queryByText('Cinema tickets')).not.toBeInTheDocument();
  });

  it('shows "No expenses found" when search yields no result', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Expenses')[0]);

    const searchInput = screen.getByPlaceholderText(/search expenses/i);
    fireEvent.change(searchInput, { target: { value: 'xxxxnotfoundxxxx' } });

    // ASSERT
    expect(screen.getByText('No expenses found')).toBeInTheDocument();
  });

  // ─── ÉCRAN ADD EXPENSE ──────────────────────────────────────────────────────
  it('renders Add Expense form with all required fields', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    const addExpenseBtn = screen.getAllByRole('button', { name: /add expense/i })[0];
    fireEvent.click(addExpenseBtn);

    // ASSERT
    expect(screen.getByRole('heading', { name: /add expense/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. lunch at café/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty Add Expense form', async () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    const addExpenseBtn = screen.getAllByRole('button', { name: /add expense/i })[0];
    fireEvent.click(addExpenseBtn);

    const saveBtn = screen.getAllByRole('button', { name: /add expense/i }).pop();
    fireEvent.click(saveBtn);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText('Label is required')).toBeInTheDocument();
      expect(screen.getByText('Enter a valid amount')).toBeInTheDocument();
      expect(screen.getByText('Select a category')).toBeInTheDocument();
    });
  });

  it('navigates back to Expenses when clicking "Back to Expenses" on Add Expense screen', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    const addExpenseBtn = screen.getAllByRole('button', { name: /add expense/i })[0];
    fireEvent.click(addExpenseBtn);

    const backBtn = screen.getByText(/back to expenses/i);
    fireEvent.click(backBtn);

    // ASSERT
    expect(screen.getByRole('heading', { name: /expenses/i })).toBeInTheDocument();
  });

  // ─── ÉCRAN CATEGORIES ───────────────────────────────────────────────────────
  it('displays existing categories on Categories screen', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Categories')[0]);

    // ASSERT
    expect(screen.getByText('Food & Drinks')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
  });

  it('shows error when trying to add a category with an empty name', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Categories')[0]);

    const addCatBtn = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addCatBtn);

    // ASSERT
    expect(screen.getByText('Category name is required.')).toBeInTheDocument();
  });

  it('shows error when adding a duplicate category name', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Categories')[0]);

    const titleInput = screen.getByPlaceholderText(/e\.g\. health/i);
    fireEvent.change(titleInput, { target: { value: 'Transport' } });

    const addCatBtn = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addCatBtn);

    // ASSERT
    expect(screen.getByText('Category already exists.')).toBeInTheDocument();
  });

  it('adds a new category successfully', async () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Categories')[0]);

    const titleInput = screen.getByPlaceholderText(/e\.g\. health/i);
    fireEvent.change(titleInput, { target: { value: 'Holidays' } });

    const addCatBtn = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(addCatBtn);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText('Holidays')).toBeInTheDocument();
    });
  });

  // ─── SUPPRESSION D'EXPENSE ──────────────────────────────────────────────────
  it('opens the delete modal when clicking the trash icon on an expense', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Expenses')[0]);

    // On cherche tous les boutons et on prend l'un des derniers qui correspond à une icône (poubellle)
    // const allButtons = screen.getAllByRole('button');
    // const deleteButtons = allButtons.filter(btn => btn.querySelector('svg'));
    
    // Le bouton de suppression est dans la liste des dépenses
    // On peut aussi chercher par le texte de la dépense puis remonter
    const expenseRow = screen.getByText('Lunch at Café').closest('div');
    const deleteBtn = expenseRow.querySelectorAll('button')[1]; // Le deuxième bouton est Trash
    fireEvent.click(deleteBtn);

    // ASSERT
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
  });

  it('cancels the delete modal without removing the expense', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);
    fireEvent.click(screen.getAllByText('Expenses')[0]);

    // Ouvrir la modal de suppression
    const expenseRow = screen.getByText('Lunch at Café').closest('div');
    const deleteBtn = expenseRow.querySelectorAll('button')[1];
    fireEvent.click(deleteBtn);

    // Cliquer sur Cancel
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    // ASSERT — la modal est fermée
    expect(screen.queryByText(/this action cannot be undone/i)).not.toBeInTheDocument();
  });

  // ─── SIDEBAR COLLAPSE ───────────────────────────────────────────────────────
  it('collapses and expands the sidebar', () => {
    // ACT
    render(<Dashboard onLogout={mockOnLogout} />);

    // myBank est visible au départ
    expect(screen.getByText('myBank')).toBeInTheDocument();

    // Le bouton collapse est le seul bouton avec un style de toggle (position absolute)
    const collapseBtn = document.querySelector('aside button');
    fireEvent.click(collapseBtn);

    // ASSERT — "myBank" disparaît après collapse
    expect(screen.queryByText('PERSONAL FINANCE')).not.toBeInTheDocument();

    // Réexpansion
    fireEvent.click(collapseBtn);
    expect(screen.getByText('PERSONAL FINANCE')).toBeInTheDocument();
  });
});
