import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  History, 
  Settings,
  LayoutDashboard,
  CheckCircle,
  FileSearch,
  ShieldCheck,
  SearchIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard, DiplomaCard } from './DashboardUI';

const EmployerDashboard = ({ user, data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard size={18} /> },
    { id: 'verify', label: 'Vérifier Diplôme', icon: <Search size={18} /> },
    { id: 'history', label: 'Historique', icon: <History size={18} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  return (
    <div className="actor-dashboard">
      <aside className="dashboard-sidebar glass">
        <div className="sidebar-header">
          <div className="avatar glass"><Briefcase size={24} /></div>
          <div className="user-info">
            <h4>{user?.firstName}</h4>
            <span>Recruteur</span>
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
            <Link to="/verify" className="btn-primary-sm"><SearchIcon size={18} /> Vérification Rapide</Link>
          </div>
        </header>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="tab-pane">
            <div className="employer-hero glass">
              <div className="hero-text">
                <h2>Vérifiez l'authenticité des diplômes instantanément</h2>
                <p>Utilisez la technologie blockchain pour valider les compétences de vos candidats en quelques secondes.</p>
                <div className="hero-search glass">
                  <Search size={20} />
                  <input 
                    type="text" 
                    placeholder="Entrez un hash de diplôme ou scannez un QR code..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn-primary">Vérifier</button>
                </div>
              </div>
              <div className="hero-stats">
                <div className="mini-stat"><strong>24k+</strong><span>Diplômes vérifiés</span></div>
                <div className="mini-stat"><strong>100%</strong><span>Fiabilité</span></div>
              </div>
            </div>

            <div className="stats-grid">
              <StatCard icon={<CheckCircle color="#10b981" />} label="Vérifications Réussies" value="128" />
              <StatCard icon={<FileSearch color="#4f46e5" />} label="Dossiers Consultés" value="342" />
              <StatCard icon={<ShieldCheck color="#8b5cf6" />} label="Fraudes Détectées" value="0" />
            </div>

            <section className="recent-section">
              <div className="section-header">
                <h2>Vérifications Récentes</h2>
                <button className="btn-link" onClick={() => setActiveTab('history')}>Voir tout l'historique <History size={16} /></button>
              </div>
              <div className="diploma-grid">
                {data.diplomas.slice(0, 3).map(d => <DiplomaCard key={d._id} diploma={d} />)}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'verify' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
            <div className="glass-card verification-tool">
               <ShieldCheck size={64} className="icon-main" />
               <h2>Outil de Vérification Blockchain</h2>
               <p>DiploChain utilise la blockchain Ethereum pour garantir que les diplômes n'ont pas été falsifiés.</p>
               <div className="verify-options">
                 <Link to="/verify" className="option-card glass">
                    <Search size={32} />
                    <h3>Par Hash / ID</h3>
                 </Link>
                 <div className="option-card glass">
                    <Briefcase size={32} />
                    <h3>Par Candidat</h3>
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
            <div className="glass-card table-container">
                <table className="data-table">
                  <thead>
                    <tr><th>Candidat</th><th>Diplôme</th><th>Date de Vérification</th><th>Résultat</th></tr>
                  </thead>
                  <tbody>
                    {data.diplomas.map(d => (
                      <tr key={d._id}>
                        <td>{d.student.firstName} {d.student.lastName}</td>
                        <td>{d.title}</td>
                        <td>{new Date().toLocaleDateString()}</td>
                        <td><span className="badge verified">Authentique</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="tab-pane">
            <div className="glass-card settings-form">
              <h3>Paramètres de Recruteur</h3>
              <div className="form-group">
                <label>Nom de l'Entreprise</label>
                <input type="text" placeholder="Ex: Tech Solutions" />
              </div>
              <div className="form-group">
                <label>Préférences de Notification</label>
                <div className="checkbox-group">
                  <input type="checkbox" checked readOnly /> <span>Alerte par email lors d'une nouvelle vérification</span>
                </div>
              </div>
              <button className="btn-primary">Sauvegarder</button>
            </div>
          </motion.div>
        )}
      </main>

      <style>{`
        .actor-dashboard { display: grid; grid-template-columns: 280px 1fr; gap: 30px; min-height: 80vh; }
        .dashboard-sidebar { padding: 30px; border-radius: 24px; display: flex; flex-direction: column; gap: 40px; }
        .sidebar-header { display: flex; align-items: center; gap: 15px; }
        .avatar { width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center; justify-content: center; background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .user-info h4 { font-size: 1rem; margin-bottom: 2px; }
        .user-info span { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        
        .sidebar-nav { display: flex; flex-direction: column; gap: 10px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 12px; border: none; background: none; color: var(--text-muted); cursor: pointer; transition: all 0.3s; position: relative; width: 100%; text-align: left; }
        .nav-item:hover { color: var(--text-main); background: rgba(255,255,255,0.05); }
        .nav-item.active { color: var(--primary); font-weight: 600; }
        .active-pill { position: absolute; left: 0; width: 4px; height: 20px; background: var(--primary); border-radius: 0 4px 4px 0; }
        
        .dashboard-content { display: flex; flex-direction: column; gap: 30px; }
        .content-header { display: flex; justify-content: space-between; align-items: center; }
        .btn-primary-sm { background: var(--glass-bg); border: 1px solid var(--primary); color: white; padding: 8px 16px; border-radius: 10px; text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; }
        
        .employer-hero { padding: 40px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%); position: relative; overflow: hidden; }
        .hero-text h2 { font-size: 1.8rem; margin-bottom: 12px; }
        .hero-text p { color: var(--text-muted); margin-bottom: 24px; max-width: 500px; }
        .hero-search { display: flex; align-items: center; gap: 15px; padding: 10px 10px 10px 20px; border-radius: 16px; background: rgba(0,0,0,0.2); }
        .hero-search input { background: none; border: none; color: white; width: 300px; outline: none; }
        
        .hero-stats { display: flex; flex-direction: column; gap: 20px; }
        .mini-stat { display: flex; flex-direction: column; align-items: flex-end; }
        .mini-stat strong { font-size: 1.5rem; color: var(--primary); }
        .mini-stat span { font-size: 0.8rem; color: var(--text-muted); }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .recent-section { margin-top: 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .btn-link { background: none; border: none; color: var(--primary); cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 600; }
        .diploma-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        
        .verification-tool { padding: 60px; display: flex; flex-direction: column; align-items: center; gap: 30px; text-align: center; }
        .verify-options { display: flex; gap: 20px; margin-top: 20px; }
        .option-card { padding: 30px; width: 200px; display: flex; flex-direction: column; align-items: center; gap: 15px; cursor: pointer; transition: transform 0.3s; text-decoration: none; color: white; }
        .option-card:hover { transform: translateY(-10px); border-color: var(--primary); }
        
        .table-container { padding: 0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { padding: 16px 24px; text-align: left; font-size: 0.8rem; color: var(--text-muted); border-bottom: 1px solid var(--glass-border); }
        .data-table td { padding: 20px 24px; border-bottom: 1px solid var(--glass-border); font-size: 0.95rem; }
        .badge { padding: 4px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .badge.verified { background: rgba(16, 185, 129, 0.1); color: #10b981; }

        .settings-form { padding: 30px; max-width: 500px; display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.9rem; color: var(--text-muted); }
        .form-group input { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 12px; border-radius: 10px; color: white; }
        .checkbox-group { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
        
        @media (max-width: 1024px) {
          .actor-dashboard { grid-template-columns: 1fr; }
          .dashboard-sidebar { display: none; }
          .hero-stats { display: none; }
        }
      `}</style>
    </div>
  );
};

export default EmployerDashboard;
