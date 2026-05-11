import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';
import IssueDiploma from './pages/IssueDiploma';
import ImportStudents from './pages/ImportStudents';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' && user;

  return (
    <div className={`app-container ${isDashboard ? 'no-global-layout' : ''}`}>
      {!isDashboard && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify/:hash?" element={<Verify />} />
          <Route path="/issue" element={<IssueDiploma />} />
          <Route path="/import" element={<ImportStudents />} />
        </Routes>
      </main>
      {!isDashboard && (
        <footer>
          <div className="container">
            <p>© 2026 DiploChain. Securing the future of academic credentials.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
