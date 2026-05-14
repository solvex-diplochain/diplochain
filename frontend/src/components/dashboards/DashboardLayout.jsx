import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  ChevronRight,
  LogOut,
  UserCircle,
  Award,
  ShieldCheck,
  User,
  GraduationCap,
  Briefcase,
  Settings as SettingsIcon,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children, tabs, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'institution': return 'Établissement Agréé';
      case 'student': return 'Étudiant';
      case 'employer': return 'Recruteur / Employeur';
      case 'admin': return 'Administrateur Système';
      default: return 'Utilisateur';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'institution': return <Building size={24} />;
      case 'student': return <GraduationCap size={24} />;
      case 'employer': return <Briefcase size={24} />;
      case 'admin': return <SettingsIcon size={24} />;
      default: return <User size={24} />;
    }
  };

  const getHeaderTitle = () => {
    if (user?.role === 'institution') return user.name || 'Université';
    return `Espace ${getRoleLabel(user?.role)}`;
  };

  return (
    <div className="actor-dashboard univ-theme">
      {/* Top Header */}
      <header className="univ-header">
        <div className="univ-logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Award size={28} />
          <span>DiploChain</span>
        </div>
        <div className="univ-header-center">
          {getHeaderTitle()}
        </div>
        <div className="univ-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#f8fafc', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
          >
            <Home size={18} />
            <span>Accueil</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '24px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
            <UserCircle size={24} />
            <span>{user?.firstName || user?.name || 'Mon Profil'}</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </header>

      <div className="univ-body">
        {/* Sidebar */}
        <aside className="univ-sidebar">
          <div className="univ-sidebar-top">
            <div className="univ-inst-icon">
              {getRoleIcon(user?.role)}
            </div>
            <div className="univ-inst-info">
              <div className="univ-inst-name">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name}</div>
              <span className="univ-key-status">{getRoleLabel(user?.role)}</span>
            </div>
          </div>

          <nav className="univ-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`univ-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
            <button className="univ-nav-item univ-nav-item-logout" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Se déconnecter</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="univ-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fade-container"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
