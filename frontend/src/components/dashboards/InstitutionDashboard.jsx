import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  PlusCircle, 
  Search, 
  BarChart3, 
  Upload, 
  Settings,
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Calendar,
  Filter,
  Download,
  ShieldCheck,
  Mail,
  Globe,
  Lock,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './InstitutionDashboard.css';
import AddStudent from './AddStudent';

const InstitutionDashboard = ({ user, data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
    { id: 'student', label: 'Inscrire Étudiant', icon: <UserPlus size={18} /> },
    { id: 'issue', label: 'Émettre Diplôme', icon: <PlusCircle size={18} /> },
    { id: 'search', label: 'Recherche & Archives', icon: <Search size={18} /> },
    { id: 'stats', label: 'Analyses & Stats', icon: <BarChart3 size={18} /> },
    { id: 'import', label: 'Importation Masse', icon: <Upload size={18} /> },
    { id: 'settings', label: 'Configuration', icon: <Settings size={18} /> },
  ];

  const renderOverview = () => (
    <>
      <div className="pro-stats-summary">
        <div className="main-stat-card glass-card pro-card">
          <div className="card-icon"><Award size={32} /></div>
          <div className="card-data">
            <span className="label">Total Diplômes Émis</span>
            <h2 className="value">{data?.diplomas?.length || 0}</h2>
            <span className="trend positive"><TrendingUp size={14} /> +12% ce mois</span>
          </div>
        </div>
        <div className="main-stat-card glass-card pro-card">
          <div className="card-icon"><Users size={32} /></div>
          <div className="card-data">
            <span className="label">Étudiants Actifs</span>
            <h2 className="value">{data.stats?.totalStudents || 0}</h2>
            <span className="trend positive"><TrendingUp size={14} /> +5%</span>
          </div>
        </div>
        <div className="main-stat-card glass-card pro-card">
          <div className="card-icon"><ShieldCheck size={32} /></div>
          <div className="card-data">
            <span className="label">Preuves On-Chain</span>
            <h2 className="value">{data.stats?.totalVerified || 0}</h2>
            <span className="trend">Statut: Sécurisé</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="recent-section glass-card pro-card">
          <div className="section-header pro-style">
            <h3>Activités Récentes</h3>
            <button className="btn-icon-glass"><Download size={18} /></button>
          </div>
          <div className="pro-table-wrapper">
            <table className="pro-data-table">
              <thead>
                <tr><th>Titulaire</th><th>Titre / Diplôme</th><th>Date d'émission</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {data?.diplomas?.slice(0, 5).map(d => (
                  <tr key={d._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">{d.student?.firstName?.[0] || 'U'}</div>
                        <span>{d.student?.firstName} {d.student?.lastName}</span>
                      </div>
                    </td>
                    <td><span className="doc-title">{d.title}</span></td>
                    <td>{new Date(d.issueDate).toLocaleDateString()}</td>
                    <td><span className={`pro-badge ${d.status}`}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer pro-style">
            <button className="btn-text" onClick={() => setActiveTab('search')}>Voir tout l'historique <ArrowRight size={16} /></button>
          </div>
        </section>

        <section className="quick-tools-section">
           <div className="glass-card pro-card tools-card">
              <h3>Accès Rapide</h3>
              <div className="tools-grid">
                <button className="tool-item" onClick={() => setActiveTab('student')}>
                  <UserPlus size={24} />
                  <span>Inscrire Étudiant</span>
                </button>
                <button className="tool-item" onClick={() => setActiveTab('import')}>
                  <Upload size={24} />
                  <span>Import Excel</span>
                </button>
                <button className="tool-item" onClick={() => navigate('/issue')}>
                  <PlusCircle size={24} />
                  <span>Nouveau Diplôme</span>
                </button>
              </div>
           </div>
           <div className="glass-card pro-card blockchain-status-card">
              <div className="status-header">
                <ShieldCheck size={24} />
                <h4>Réseau Blockchain</h4>
              </div>
              <div className="status-body">
                <div className="status-item">
                  <span>Statut</span>
                  <span className="val success">Opérationnel</span>
                </div>
                <div className="status-item">
                  <span>Dernier Bloc</span>
                  <span className="val">#182934</span>
                </div>
              </div>
           </div>
        </section>
      </div>
    </>
  );

  return (
    <div className="actor-dashboard">
      <aside className="dashboard-sidebar glass">
        <div className="sidebar-header">
          <div className="avatar glass"><Building size={24} /></div>
          <div className="user-info">
            <h4>{user?.name}</h4>
            <span>Etablissement Agréé</span>
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
            <button className="btn-secondary-sm pulse"><Calendar size={18} /> Session 2026</button>
            <Link to="/issue" className="btn-primary pro-btn"><PlusCircle size={18} /> Nouvel Acte</Link>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="tab-pane"
            >
              {renderOverview()}
            </motion.div>
          )}

          {activeTab === 'student' && (
            <motion.div 
              key="student"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="tab-pane"
            >
              <AddStudent />
            </motion.div>
          )}

          {activeTab === 'issue' && (
            <motion.div 
              key="issue"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="tab-pane"
            >
              <div className="glass-card pro-card message-card hero-style">
                <div className="hero-icon-bg"><PlusCircle size={80} /></div>
                <h2>Émission de Certification Officielle</h2>
                <p>Authentifiez les parcours académiques de vos étudiants sur la blockchain DiploChain.</p>
                <div className="hero-actions">
                  <Link to="/issue" className="btn-primary pro-btn-lg">Accéder au Formulaire <ArrowRight size={20} /></Link>
                  <button className="btn-secondary pro-btn-lg" onClick={() => setActiveTab('import')}>Importation en Masse</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div 
              key="search"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="tab-pane"
            >
              <div className="search-controls glass-card pro-card">
                <div className="search-bar pro-style">
                  <Search size={20} />
                  <input type="text" placeholder="Nom de l'étudiant, matricule ou hash blockchain..." />
                </div>
                <div className="filter-group">
                  <div className="filter-item">
                    <label>Niveau</label>
                    <select><option>Tous</option><option>Bachelor</option><option>Master</option></select>
                  </div>
                  <div className="filter-item">
                    <label>Statut</label>
                    <select><option>Tous</option><option>Émis</option><option>Révoqué</option></select>
                  </div>
                  <button className="btn-icon-glass"><Filter size={18} /></button>
                </div>
              </div>
              <div className="glass-card pro-card table-container-pro">
                 <table className="pro-data-table">
                    <thead>
                      <tr><th>Matricule</th><th>Étudiant</th><th>Filière</th><th>Date d'Emission</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {data?.diplomas?.map(d => (
                        <tr key={d._id}>
                          <td><code>{d.student?.studentProfile?.studentId || 'N/A'}</code></td>
                          <td><strong>{d.student?.firstName} {d.student?.lastName}</strong></td>
                          <td>{d.title}</td>
                          <td>{new Date(d.issueDate).toLocaleDateString()}</td>
                          <td><button className="btn-icon-glass"><ExternalLink size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="tab-pane pro-stats-page"
            >
               <div className="stats-grid-pro">
                 <div className="glass-card pro-card chart-card">
                   <div className="chart-header">
                     <h3>Émissions Mensuelles</h3>
                     <TrendingUp size={20} />
                   </div>
                   <div className="chart-mock">
                     <div className="bar" style={{ height: '40%' }}></div>
                     <div className="bar" style={{ height: '60%' }}></div>
                     <div className="bar" style={{ height: '45%' }}></div>
                     <div className="bar" style={{ height: '90%' }}></div>
                     <div className="bar" style={{ height: '75%' }}></div>
                   </div>
                 </div>
                 <div className="glass-card pro-card info-card">
                   <div className="info-header">
                     <BarChart3 size={24} />
                     <h4>Taux de Vérification</h4>
                     <p><strong>68%</strong> des diplômes émis ont été vérifiés au moins une fois par des recruteurs.</p>
                   </div>
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'import' && (
            <motion.div 
              key="import"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="tab-pane"
            >
              <div className="glass-card pro-card message-card hero-style">
                <div className="hero-icon-bg"><Upload size={80} /></div>
                <h2>Importation Collective</h2>
                <p>Gagnez du temps en important des listes d'étudiants via des fichiers Excel ou CSV sécurisés.</p>
                <div className="hero-actions">
                  <Link to="/import" className="btn-primary pro-btn-lg">Lancer l'Importation <ArrowRight size={20} /></Link>
                  <button className="btn-secondary pro-btn-lg">Télécharger le Modèle</button>
                </div>
                <div className="pro-tips">
                  <span>💡 Conseil: Utilisez notre modèle standard pour éviter les erreurs de formatage.</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="tab-pane pro-settings"
            >
              <div className="settings-grid">
                <div className="glass-card pro-card settings-section">
                  <h3>Profil de l'Institution</h3>
                  <div className="form-group pro-group">
                    <label>Nom de l'Université</label>
                    <div className="input-with-icon">
                      <Building size={18} />
                      <input type="text" value={user?.name} disabled />
                    </div>
                  </div>
                  <div className="form-group pro-group">
                    <label>Email de Contact</label>
                    <div className="input-with-icon">
                      <Mail size={18} />
                      <input type="email" value={user?.email} disabled />
                    </div>
                  </div>
                  <div className="form-group pro-group">
                    <label>Site Web Officiel</label>
                    <div className="input-with-icon">
                      <Globe size={18} />
                      <input type="text" value="www.univ-ouaga.bf" />
                    </div>
                  </div>
                  <button className="btn-primary pro-btn">Mettre à jour le profil</button>
                </div>

                <div className="glass-card pro-card settings-section">
                  <h3>Sécurité & Blockchain</h3>
                  <div className="form-group pro-group">
                    <label>Clé Publique (Adresse)</label>
                    <div className="input-with-icon">
                      <Lock size={18} />
                      <input type="text" value="0x71C765...d897" disabled />
                    </div>
                  </div>
                  <div className="form-group pro-group">
                     <label>Méthode de Signature</label>
                     <select className="pro-select">
                       <option>Signature Numérique Standard (ECDSA)</option>
                       <option>Multi-Signature (Bientôt)</option>
                     </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default InstitutionDashboard;
