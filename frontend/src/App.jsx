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
        <footer className="main-footer">
          <div className="container footer-content">
            <div className="footer-brand">
              <h3 className="footer-logo">DiploChain</h3>
              <p className="footer-desc">
                La Blockchain, levier du développement durable africain. <br/>
                Projet BF-01 — Solution de certification académique infalsifiable pour le Burkina Faso.
              </p>
              <div className="footer-odd">
                <span className="badge-odd">ODD 4</span>
                <span className="badge-odd">ODD 8</span>
                <span className="badge-odd">ODD 16</span>
              </div>
            </div>
            
            <div className="footer-links">
              <h4>Plateforme</h4>
              <ul>
                <li><a href="/">Accueil</a></li>
                <li><a href="/verify">Vérifier un diplôme</a></li>
                <li><a href="/login">Connexion</a></li>
                <li><a href="/register">Inscription</a></li>
              </ul>
            </div>
            
            <div className="footer-contact">
              <h4>Miabe Hackathon 2026</h4>
              <p><strong>Édition :</strong> Burkina Faso 🇧🇫</p>
              <p><strong>Cadre :</strong> Éducation & Certification blockchain</p>
              <p><strong>Soutenu par :</strong> Darollo Technologies Corporation (DTC)</p>
              <a href="https://www.miabehackathon.com" target="_blank" rel="noreferrer" className="footer-link-ext">www.miabehackathon.com</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <p>© {new Date().getFullYear()} DiploChain. Développé pour la Finale du Miabe Hackathon.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
