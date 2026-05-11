import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky-nav">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Shield className="logo-icon" size={32} />
          <span>DiploChain</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          <Link to="/verify" className="nav-item">Vérifier</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-item">Tableau de bord</Link>
              {user.role === 'institution' && (
                <Link to="/issue" className="nav-item">Émettre</Link>
              )}
              <div className="user-menu">
                <span className="user-name">{user.firstName}</span>
                <button onClick={handleLogout} className="btn-icon">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-secondary">Connexion</Link>
              <Link to="/register" className="btn-primary">Inscription</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-menu glass"
        >
          <Link to="/verify" onClick={() => setIsOpen(false)}>Vérifier</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Connexion</Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>Inscription</Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
