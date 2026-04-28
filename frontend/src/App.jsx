import { useState, useEffect } from 'react';
import { api } from './services/api';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.getMe();
          setLoggedIn(true);
        } catch {
          console.error('Error checking authentication.....');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null; // Or a splash screen

  if (loggedIn) {
    return <Dashboard onLogout={() => { api.logout(); setLoggedIn(false); }} />;
  }

  return authMode === 'login' ? (
    <Login 
      onLogin={() => setLoggedIn(true)} 
      onSwitchToRegister={() => setAuthMode('register')} 
    />
  ) : (
    <Register 
      onRegister={() => setAuthMode('login')} 
      onSwitchToLogin={() => setAuthMode('login')} 
    />
  );
}

export default App;
