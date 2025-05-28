import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedUser = urlParams.get('user');

  if (encodedUser && !user) {
    try {
      const userData = JSON.parse(atob(encodedUser));
      setUser(userData);

      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error('Failed to decode user info:', err);
      alert('Login failed. Please try again.');
    }
  }
}, [user]);


const handleLogin = () => {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;
};

  const handleLogout = () => {
    setUser(null);
    // Optionally redirect to Microsoft logout
    // window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/logout`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Authenticating...</h2>
        <p>Please wait while we verify your credentials.</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          user ? (
            <Home user={user} onLogout={handleLogout} />
          ) : (
            <div className="login-container">
              <div className="login-card">
                <h1>K.R. Mangalam University</h1>
                <h2>Student Portal</h2>
                <p>Please sign in with your university email address</p>
                <button onClick={handleLogin} className="login-button">
                  Sign in with Microsoft
                </button>
              </div>
            </div>
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;