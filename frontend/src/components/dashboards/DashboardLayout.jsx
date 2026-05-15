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
  Home,
  Search
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
        <div className="univ-header-left" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div className="univ-header-badge">
            {getHeaderTitle()}
          </div>

          <div className="univ-header-search">
            <Search className="search-icon-nav" size={16} />
            <input 
              type="text" 
              className="univ-search-input" 
              placeholder="Rechercher un étudiant ou un diplôme..." 
            />
          </div>
        </div>
        
        <div className="univ-header-right">
          <div className="univ-user-profile" onClick={() => navigate('/')}>
            <div className="univ-avatar">
              {(user?.firstName || user?.name || 'U').charAt(0)}
            </div>
            <div className="univ-user-info">
              <span className="univ-user-name">{user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.name || 'Mon Profil')}</span>
            </div>
            <span className="univ-chevron">▾</span>
          </div>
        </div>
      </header>

      <div className="univ-body">
        {/* Sidebar */}
        <aside className="univ-sidebar">
          <div className="univ-sidebar-logo" onClick={() => navigate('/')}>
            🔗 Diplo<span>Chain</span>
          </div>

          <div className="univ-sidebar-top">
            <div className="univ-inst-icon">
              {getRoleIcon(user?.role)}
            </div>
            <div className="univ-inst-info">
              <div className="univ-inst-name">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name}</div>
              <span className="univ-key-status">
                {getRoleLabel(user?.role)} {user?.role === 'institution' && <span className="lock-icon">🔒</span>}
              </span>
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
                {activeTab === tab.id && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
              </button>
            ))}

            <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: 20 }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div className="pulse-dot"></div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>RÉSEAU ACTIF</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Nœud Burkina Faso #04</div>
              </div>

              <button className="univ-nav-item univ-nav-item-logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
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
