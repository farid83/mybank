import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Dashboard, { DashboardScreen, CategoriesScreen } from './components/Dashboard/Dashboard.jsx';
import Expenses from './components/Expenses/Expenses.jsx';
import ExpenseForm from './components/Expenses/ExpenseForm.jsx';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.getMe();
          setLoggedIn(true);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        {loggedIn ? (
          <>
            <Route
              path="/dashboard"
              element={<Dashboard onLogout={() => { api.logout(); setLoggedIn(false); }} />}
            >
              <Route index element={<DashboardScreen />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="categories" element={<CategoriesScreen />} />
              <Route path="add-expense" element={<ExpenseForm />} />
              <Route path="edit-expense/:id" element={<ExpenseForm />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route
              path="/login"
              element={<Login onLogin={() => setLoggedIn(true)} />}
            />
            <Route
              path="/register"
              element={<Register onRegister={() => setLoggedIn(true)} />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;