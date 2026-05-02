import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';
import IssueDiploma from './pages/IssueDiploma';
import ImportStudents from './pages/ImportStudents';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
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
          <footer>
            <div className="container">
              <p>© 2026 DiploChain. Securing the future of academic credentials.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
