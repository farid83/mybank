import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard, { DashboardScreen, CategoriesScreen } from './Dashboard';
import Expenses from '../Expenses/Expenses';
import ExpenseForm from '../Expenses/ExpenseForm';
import { api } from '../../services/api';
import operationsFixture from '../../test/fixtures/operations.json';
import categoriesFixture from '../../test/fixtures/categories.json';

// Mock the API service
vi.mock('../../services/api', () => ({
  api: {
    getOperations: vi.fn(),
    getCategories: vi.fn(),
    deleteOperation: vi.fn(),
    createOperation: vi.fn(),
    updateOperation: vi.fn(),
    getMe: vi.fn(),
  }
}));

describe('Dashboard Component', () => {
  const mockOnLogout = vi.fn();

  const renderDashboard = () => {
    return render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard onLogout={mockOnLogout} />}>
            <Route index element={<DashboardScreen />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="categories" element={<CategoriesScreen />} />
            <Route path="add-expense" element={<ExpenseForm />} />
            <Route path="edit-expense/:id" element={<ExpenseForm />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.getOperations.mockResolvedValue(operationsFixture);
    api.getCategories.mockResolvedValue(categoriesFixture);
    api.getMe.mockResolvedValue({ id: 1, email: 'user@example.com' });
  });

  it('renders the dashboard with summary cards', async () => {
    renderDashboard();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/CONNECTING TO BANK/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Good morning 🌤️')).toBeInTheDocument();
    expect(screen.getByText('TOTAL BALANCE')).toBeInTheDocument();
    expect(screen.getByText('TOTAL SPENT')).toBeInTheDocument();
    expect(screen.getByText('TRANSACTIONS')).toBeInTheDocument();
  });

  it('displays the list of recent expenses', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Recent Expenses')).toBeInTheDocument();
    });

    // Check if fixture data is rendered
    expect(screen.getByText('Lunch at Café')).toBeInTheDocument();
    expect(screen.getByText('Metro monthly pass')).toBeInTheDocument();
  });

  it('switches to the full expenses screen', async () => {
    renderDashboard();

    await waitFor(() => screen.getByText('Recent Expenses'));

    const seeAllButton = screen.getByText(/See all/i);
    fireEvent.click(seeAllButton);

    expect(screen.getByText('Expenses', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search expenses/i)).toBeInTheDocument();
  });

  it('opens the add expense screen', async () => {
    renderDashboard();

    await waitFor(() => screen.getByText('Recent Expenses'));

    // Go to expenses list first
    fireEvent.click(screen.getByText(/See all/i));

    const addButton = screen.getAllByText(/Add Expense/i)[0];
    fireEvent.click(addButton);

    expect(screen.getByRole('heading', { name: 'Add Expense', level: 1 })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Lunch at Café/i)).toBeInTheDocument();
  });

  it('can logout from the top bar', async () => {
    renderDashboard();

    await waitFor(() => screen.getByText('Good morning 🌤️'));

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
