import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Building, 
  BarChart3, 
  PlusCircle, 
  Settings,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Database,
  Activity,
  Users
} from 'lucide-react';
import { StatCard } from './DashboardUI';

const AdminDashboard = ({ user, data, onToggleInstitution }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard size={18} /> },
    { id: 'institutions', label: 'Établissements', icon: <Building size={18} /> },
    { id: 'stats', label: 'Statistiques', icon: <BarChart3 size={18} /> },
    { id: 'add', label: 'Ajout Établissement', icon: <PlusCircle size={18} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  return (
    <div className="actor-dashboard">
      <aside className="dashboard-sidebar glass">
        <div className="sidebar-header">
          <div className="avatar glass"><ShieldCheck size={24} /></div>
          <div className="user-info">
            <h4>{user?.firstName}</h4>
            <span>Ministère / Admin</span>
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
             <div className="status-indicator">
                <span className="dot pulse"></span>
                <span>Blockchain Live</span>
             </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="tab-pane">
            <div className="stats-grid">
              <StatCard icon={<Building color="#4f46e5" />} label="Institutions" value={data.institutions.length} />
              <StatCard icon={<Database color="#10b981" />} label="Diplômes On-Chain" value={data.stats?.totalDiplomas || 0} />
              <StatCard icon={<Activity color="#8b5cf6" />} label="Transactions" value={data.stats?.totalVerified || 0} />
              <StatCard icon={<Users color="#f59e0b" />} label="Total Acteurs" value={data.stats?.totalStudents || 0} />
            </div>

            <section className="recent-section">
              <div className="section-header">
                <h2>Demandes d'approbation</h2>
              </div>
              <div className="glass-card table-container">
                <table className="data-table">
                  <thead>
                    <tr><th>Nom</th><th>Email</th><th>Statut</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {data.institutions.map(inst => (
                      <tr key={inst._id}>
                        <td><div className="name-cell"><Building size={16}/> {inst.name}</div></td>
                        <td>{inst.email}</td>
                        <td>
                          <span className={`badge ${inst.isVerified ? 'verified' : 'pending'}`}>
                            {inst.isVerified ? 'Vérifié' : 'En attente'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={`btn-status ${inst.isVerified ? 'revoke' : 'approve'}`}
                            onClick={() => onToggleInstitution(inst._id, inst.isVerified)}
                          >
                            {inst.isVerified ? <XCircle size={18}/> : <CheckCircle2 size={18}/>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'institutions' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
             <div className="section-header">
                <h2>Liste des Établissements Partenaires</h2>
                <button className="btn-primary-sm" onClick={() => setActiveTab('add')}><PlusCircle size={18} /> Ajouter</button>
              </div>
             <div className="glass-card table-container">
                <table className="data-table">
                   <thead>
                    <tr><th>Nom</th><th>Email</th><th>Diplômes Émis</th><th>Statut</th></tr>
                  </thead>
                  <tbody>
                    {data.institutions.map(inst => (
                      <tr key={inst._id}>
                        <td><strong>{inst.name}</strong></td>
                        <td>{inst.email}</td>
                        <td>{Math.floor(Math.random() * 500)}</td>
                        <td><span className={`badge ${inst.isVerified ? 'verified' : 'pending'}`}>{inst.isVerified ? 'Actif' : 'Bloqué'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
            <div className="glass-card chart-placeholder">
               <BarChart3 size={48} className="icon-main" />
               <h3>Analyses Globales DiploChain</h3>
               <p>Graphiques et statistiques détaillées sur l'utilisation du système à l'échelle nationale.</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'add' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
            <div className="glass-card form-container">
               <h2>Inscrire un nouvel établissement</h2>
               <p>Ajoutez une université ou un centre de formation au réseau DiploChain.</p>
               <div className="form-grid">
                  <div className="form-group">
                    <label>Nom de l'Institution</label>
                    <input type="text" placeholder="Ex: Université Joseph Ki-Zerbo" />
                  </div>
                  <div className="form-group">
                    <label>Email de contact</label>
                    <input type="email" placeholder="admin@univ-jkz.bf" />
                  </div>
               </div>
               <button className="btn-primary">Envoyer l'invitation</button>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
             <div className="glass-card settings-form">
              <h3>Contrôle du Système</h3>
              <div className="form-group">
                <label>Frais de Gas par défaut</label>
                <input type="text" value="0.005 ETH" />
              </div>
              <div className="form-group">
                <label>Mode Maintenance</label>
                <button className="btn-secondary">Activer le mode maintenance</button>
              </div>
              <button className="btn-primary">Sauvegarder les paramètres</button>
            </div>
          </motion.div>
        )}
      </main>

      <style>{`
        .actor-dashboard { display: grid; grid-template-columns: 280px 1fr; gap: 30px; min-height: 80vh; }
        .dashboard-sidebar { padding: 30px; border-radius: 24px; display: flex; flex-direction: column; gap: 40px; }
        .sidebar-header { display: flex; align-items: center; gap: 15px; }
        .avatar { width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center; justify-content: center; background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .user-info h4 { font-size: 1rem; margin-bottom: 2px; }
        .user-info span { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        
        .sidebar-nav { display: flex; flex-direction: column; gap: 10px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 12px; border: none; background: none; color: var(--text-muted); cursor: pointer; transition: all 0.3s; position: relative; width: 100%; text-align: left; }
        .nav-item:hover { color: var(--text-main); background: rgba(255,255,255,0.05); }
        .nav-item.active { color: var(--primary); font-weight: 600; }
        .active-pill { position: absolute; left: 0; width: 4px; height: 20px; background: var(--primary); border-radius: 0 4px 4px 0; }
        
        .dashboard-content { display: flex; flex-direction: column; gap: 30px; }
        .content-header { display: flex; justify-content: space-between; align-items: center; }
        .status-indicator { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 6px 16px; border-radius: 50px; }
        .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
        .dot.pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .recent-section { margin-top: 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        
        .table-container { padding: 0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { padding: 16px 24px; text-align: left; font-size: 0.8rem; color: var(--text-muted); border-bottom: 1px solid var(--glass-border); }
        .data-table td { padding: 20px 24px; border-bottom: 1px solid var(--glass-border); font-size: 0.95rem; }
        .badge { padding: 4px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .badge.verified { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        
        .btn-status { background: none; border: none; cursor: pointer; transition: transform 0.2s; }
        .btn-status.approve { color: #10b981; }
        .btn-status.revoke { color: #ef4444; }
        
        .chart-placeholder { padding: 60px; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
        .icon-main { color: var(--primary); }
        
        .form-container { padding: 40px; display: flex; flex-direction: column; gap: 30px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.9rem; color: var(--text-muted); }
        .form-group input { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 12px; border-radius: 10px; color: white; }

        .settings-form { padding: 30px; max-width: 500px; display: flex; flex-direction: column; gap: 20px; }
        
        @media (max-width: 1024px) {
          .actor-dashboard { grid-template-columns: 1fr; }
          .dashboard-sidebar { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
