import Login from './components/Login/Login.jsx'

function App() {
  const handleLogin = () => {
    console.log('User logged in successfully');
    // TODO: Navigate to dashboard or main app
  };

  return <Login onLogin={handleLogin} />
}

export default App
