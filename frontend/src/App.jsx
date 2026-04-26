import { useState } from 'react';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  if (loggedIn) {
    return <Dashboard onLogout={() => setLoggedIn(false)} />;
  }

  return authMode === 'login' ? (
    <Login 
      onLogin={() => setLoggedIn(true)} 
      onSwitchToRegister={() => setAuthMode('register')} 
    />
  ) : (
    <Register 
      onRegister={() => setLoggedIn(true)} 
      onSwitchToLogin={() => setAuthMode('login')} 
    />
  );
}

export default App;
