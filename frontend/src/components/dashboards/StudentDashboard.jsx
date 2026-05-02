import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  Bell, 
  Settings, 
  Share2, 
  LayoutDashboard,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { StatCard, DiplomaCard } from './DashboardUI';

const StudentDashboard = ({ user, data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard size={18} /> },
    { id: 'diplomas', label: 'Mes Diplômes', icon: <Award size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  return (
    <div className="actor-dashboard">
      <aside className="dashboard-sidebar glass">
        <div className="sidebar-header">
          <div className="avatar glass">{user?.firstName?.[0]}</div>
          <div className="user-info">
            <h4>{user?.firstName} {user?.lastName}</h4>
            <span>Étudiant</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="active-pill" className="active-pill" />}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
          <h1>{tabs.find(t => t.id === activeTab).label}</h1>
          <div className="header-actions">
            <button className="btn-icon-glass"><Bell size={20} /></button>
            <button className="btn-icon-glass"><Settings size={20} /></button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="tab-pane">
            <div className="stats-grid">
              <StatCard icon={<Award color="#4f46e5" />} label="Certifications" value={data.diplomas.length} />
              <StatCard icon={<CheckCircle color="#10b981" />} label="Vérifiés" value={data.diplomas.filter(d => d.status === 'verified').length} />
              <StatCard icon={<Clock color="#f59e0b" />} label="En attente" value={0} />
            </div>

            <section className="recent-section">
              <div className="section-header">
                <h2>Diplômes Récents</h2>
                <button className="btn-link" onClick={() => setActiveTab('diplomas')}>Voir tout <ChevronRight size={16} /></button>
              </div>
              <div className="diploma-grid">
                {data.diplomas.slice(0, 2).map(d => <DiplomaCard key={d._id} diploma={d} />)}
                {data.diplomas.length === 0 && <div className="empty-state glass">Aucun diplôme trouvé</div>}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'diplomas' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
            <div className="diploma-grid">
              {data.diplomas.map(d => <DiplomaCard key={d._id} diploma={d} />)}
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
            <div className="glass-card notifications-list">
              <div className="notification-item unread">
                <div className="icon-box"><Award size={20} /></div>
                <div className="notif-body">
                  <p>Votre diplôme de <strong>Master en Blockchain</strong> a été émis par <strong>Université de Ouagadougou</strong>.</p>
                  <span>Il y a 2 heures</span>
                </div>
              </div>
              <div className="notification-item">
                <div className="icon-box"><Share2 size={20} /></div>
                <div className="notif-body">
                  <p>Votre diplôme a été consulté par <strong>Société Générale</strong>.</p>
                  <span>Hier</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
            <div className="glass-card settings-form">
              <h3>Profil</h3>
              <div className="form-group">
                <label>Nom complet</label>
                <input type="text" value={`${user?.firstName} ${user?.lastName}`} disabled />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email} disabled />
              </div>
              <button className="btn-primary">Mettre à jour le profil</button>
            </div>
          </motion.div>
        )}
      </main>

      <style>{`
        .actor-dashboard { display: grid; grid-template-columns: 280px 1fr; gap: 30px; min-height: 80vh; }
        .dashboard-sidebar { padding: 30px; border-radius: 24px; display: flex; flex-direction: column; gap: 40px; }
        .sidebar-header { display: flex; align-items: center; gap: 15px; }
        .avatar { width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; color: var(--primary); }
        .user-info h4 { font-size: 1rem; margin-bottom: 2px; }
        .user-info span { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        
        .sidebar-nav { display: flex; flex-direction: column; gap: 10px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 12px; border: none; background: none; color: var(--text-muted); cursor: pointer; transition: all 0.3s; position: relative; width: 100%; text-align: left; }
        .nav-item:hover { color: var(--text-main); background: rgba(255,255,255,0.05); }
        .nav-item.active { color: var(--primary); font-weight: 600; }
        .active-pill { position: absolute; left: 0; width: 4px; height: 20px; background: var(--primary); border-radius: 0 4px 4px 0; }
        
        .dashboard-content { display: flex; flex-direction: column; gap: 30px; }
        .content-header { display: flex; justify-content: space-between; align-items: center; }
        .header-actions { display: flex; gap: 12px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .recent-section { margin-top: 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .btn-link { background: none; border: none; color: var(--primary); cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 600; }
        
        .notifications-list { padding: 10px; display: flex; flex-direction: column; }
        .notification-item { display: flex; gap: 15px; padding: 20px; border-bottom: 1px solid var(--glass-border); transition: background 0.3s; border-radius: 12px; }
        .notification-item:last-child { border-bottom: none; }
        .notification-item.unread { background: rgba(79, 70, 229, 0.05); }
        .icon-box { width: 40px; height: 40px; background: rgba(255,255,255,0.05); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .notif-body p { font-size: 0.95rem; margin-bottom: 4px; }
        .notif-body span { font-size: 0.8rem; color: var(--text-muted); }
        
        .settings-form { padding: 30px; max-width: 500px; display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.9rem; color: var(--text-muted); }
        .form-group input { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 12px; border-radius: 10px; color: white; }
        
        @media (max-width: 1024px) {
          .actor-dashboard { grid-template-columns: 1fr; }
          .dashboard-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
