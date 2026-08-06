import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { fetchUserProfile } from './utils/api';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'dashboard'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState(null);

  // Set theme attribute on html/body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check persistent user session on initial load via JWT token
  useEffect(() => {
    const checkAuthSession = async () => {
      const token = localStorage.getItem('klu_jwt_token');
      if (token) {
        try {
          const profile = await fetchUserProfile();
          setUser(profile);
          setView('dashboard');
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('klu_jwt_token');
          setUser(null);
          setView('login');
        }
      }
      setLoading(false);
    };

    checkAuthSession();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('klu_jwt_token');
    setUser(null);
    setView('login');
    showToast('Logged out successfully.', 'info');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '4px solid rgba(155, 27, 48, 0.2)',
          borderTopColor: 'var(--primary-crimson)',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading KLU Student Portal...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Banner */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Campus Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Router View */}
      <main style={{ flex: 1 }}>
        {view === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            switchToRegister={() => setView('register')}
            showToast={showToast}
          />
        )}

        {view === 'register' && (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            switchToLogin={() => setView('login')}
            showToast={showToast}
          />
        )}

        {view === 'dashboard' && user && (
          <Dashboard
            user={user}
            setUser={setUser}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}
