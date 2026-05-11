import React, { useState, useEffect } from 'react';
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
  UserPlus,
  AlertTriangle,
  Pencil,
  MapPin,
  Phone,
  History,
  UserCog,
  Pause,
  Save,
  Key,
  ShieldCheck as ShieldIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import AddStudent from './AddStudent';
import StudentList from './StudentList';
import API from '../../services/api';

const InstitutionDashboard = ({ user, data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsTab, setSettingsTab] = useState('profile');
  const [timeFilter, setTimeFilter] = useState('30days');
  const [profile, setProfile] = useState({
    name: user?.name || 'Université de Ouagadougou',
    sigle: 'UO',
    type: 'public',
    region: 'Centre',
    ville: 'Ouagadougou',
    adresse: "Avenue de l'Université, Secteur 4",
    website: 'https://www.uo.bf',
    email: 'contact@uo.bf',
    phone: '+226 25 30 XX XX'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/institutions/my-profile');
        if (response.data.success) {
          const inst = response.data.data;
          setProfile({
            name: inst.name || '',
            sigle: inst.sigle || '',
            type: inst.type || 'university',
            region: inst.address?.region || '',
            ville: inst.address?.city || '',
            adresse: inst.address?.street || '',
            website: inst.website || '',
            email: inst.email || '',
            phone: inst.phone || ''
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: profile.name,
        sigle: profile.sigle,
        type: profile.type,
        address: {
          street: profile.adresse,
          city: profile.ville,
          region: profile.region,
          country: 'Burkina Faso'
        },
        website: profile.website,
        phone: profile.phone
        // Email is usually not updatable via this form for security
      };

      const response = await API.put('/institutions/my-profile', updateData);
      if (response.data.success) {
        alert('Profil institutionnel mis à jour avec succès !');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  // Dummy Data for Statistics
  const lineData = [
    { name: 'Jan', value: 45 }, { name: 'Fév', value: 58 }, { name: 'Mar', value: 52 },
    { name: 'Avr', value: 78 }, { name: 'Mai', value: 65 }, { name: 'Juin', value: 85 },
    { name: 'Juil', value: 78 }, { name: 'Août', value: 110 }, { name: 'Sep', value: 92 },
    { name: 'Oct', value: 125 }, { name: 'Nov', value: 115 }, { name: 'Déc', value: 145 },
  ];

  const pieData = [
    { name: 'Informatique', value: 32 },
    { name: 'Médecine', value: 24 },
    { name: 'Droit', value: 18 },
    { name: 'Économie', value: 14 },
    { name: 'Autres', value: 12 },
  ];
  const COLORS = ['#1e293b', '#334155', '#f59e0b', '#64748b', '#94a3b8'];

  const barData = [
    { name: 'Jan', value: 85 }, { name: 'Fév', value: 120 }, { name: 'Mar', value: 95 },
    { name: 'Avr', value: 140 }, { name: 'Sep', value: 110 }, { name: 'Oct', value: 160 },
    { name: 'Nov', value: 135 }, { name: 'Déc', value: 180 },
  ];

  const tabs = [
    { id: 'overview', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
    { id: 'student', label: 'Inscrire Étudiant', icon: <UserPlus size={18} /> },
    { id: 'issue', label: 'Émettre Diplôme', icon: <PlusCircle size={18} /> },
    { id: 'search', label: 'Recherche & Archives', icon: <Search size={18} /> },
    { id: 'list', label: 'Liste Étudiants', icon: <Users size={18} /> },
    { id: 'stats', label: 'Analyses & Stats', icon: <BarChart3 size={18} /> },
    { id: 'import', label: 'Importation Masse', icon: <Upload size={18} /> },
    { id: 'settings', label: 'Configuration', icon: <Settings size={18} /> },
  ];

  const renderOverview = () => (
    <>
      <div className="univ-stats-grid">
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data?.diplomas?.length || 0}</h3>
            <span className="univ-stat-label">Total Diplômes Émis</span>
            <span className="univ-stat-trend positive">+12% ce mois</span>
          </div>
          <div className="univ-stat-icon-mini"><TrendingUp size={24} color="#22c55e" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.stats?.totalStudents || 0}</h3>
            <span className="univ-stat-label">Étudiants Actifs</span>
            <span className="univ-stat-trend positive">+5%</span>
          </div>
          <div className="univ-stat-icon-mini"><Users size={24} color="#1e293b" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.stats?.totalVerified || 0}</h3>
            <span className="univ-stat-label">Preuves On-Chain</span>
            <span className="univ-stat-trend">Système Sécurisé</span>
          </div>
          <div className="univ-stat-icon-mini"><ShieldCheck size={24} color="#1e293b" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">99.9%</h3>
            <span className="univ-stat-label">Uptime Blockchain</span>
            <span className="univ-stat-trend positive">Opérationnel</span>
          </div>
          <div className="univ-stat-icon-mini"><Globe size={24} color="#1e293b" /></div>
        </div>
      </div>

      <div className="univ-dashboard-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="univ-panel">
          <div className="univ-panel-header">
            <h3>Activités Récentes</h3>
            <button className="univ-btn-outline" style={{ padding: '4px 8px' }}><Download size={16} /></button>
          </div>
          <div className="univ-panel-body" style={{ padding: 0 }}>
             <table className="univ-data-table">
               <thead>
                 <tr><th>Titulaire</th><th>Titre / Diplôme</th><th>Date d'émission</th><th>Statut</th></tr>
               </thead>
               <tbody>
                 {data?.diplomas?.slice(0, 5).map(d => (
                   <tr key={d._id}>
                     <td><strong>{d.student?.firstName} {d.student?.lastName}</strong></td>
                     <td>{d.title}</td>
                     <td>{new Date(d.issueDate).toLocaleDateString()}</td>
                     <td><span className="univ-status-badge registered"><CheckCircle size={12} /> {d.status}</span></td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        <div className="univ-panel">
          <div className="univ-panel-header"><h3>Accès Rapide</h3></div>
          <div className="univ-panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <button className="univ-btn-outline" onClick={() => setActiveTab('student')} style={{ justifyContent: 'flex-start', width: '100%', padding: '12px' }}>
                <UserPlus size={18} /> <span>Inscrire Étudiant</span>
              </button>
              <button className="univ-btn-outline" onClick={() => setActiveTab('import')} style={{ justifyContent: 'flex-start', width: '100%', padding: '12px' }}>
                <Upload size={18} /> <span>Import Excel</span>
              </button>
              <Link to="/issue" className="univ-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', justifyContent: 'center' }}>
                <PlusCircle size={18} /> <span>Nouveau Diplôme</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderOverview()}
          </motion.div>
        )}

        {activeTab === 'student' && (
          <motion.div key="student" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="univ-panel">
              <div className="univ-panel-header"><h2>Inscription de Nouvel Étudiant</h2></div>
              <div className="univ-panel-body"><AddStudent /></div>
            </div>
          </motion.div>
        )}

        {activeTab === 'issue' && (
          <motion.div key="issue" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="univ-panel" style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ background: '#fef3c7', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycenter: 'center', margin: '0 auto 24px', color: '#f59e0b' }}>
                <PlusCircle size={48} />
              </div>
              <h2>Émission de Certification</h2>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>Authentifiez les parcours académiques de vos étudiants sur la blockchain.</p>
              <Link to="/issue" className="univ-btn-primary" style={{ display: 'inline-flex', padding: '14px 28px', textDecoration: 'none' }}>Accéder au Formulaire <ArrowRight size={20} /></Link>
            </div>
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div key="search" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <div className="univ-panel">
                <div className="univ-panel-header">
                  <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                      <input type="text" placeholder="Rechercher par nom, matricule ou hash..." style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    <button className="univ-btn-outline"><Filter size={18} /> Filtres</button>
                  </div>
                </div>
                <div className="univ-panel-body" style={{ padding: 0 }}>
                  <table className="univ-data-table">
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
                          <td><button className="univ-btn-outline" style={{ padding: '4px' }}><ExternalLink size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <StudentList students={data?.students} />
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stats-view-container">
            <header className="stats-header-pro">
              <div className="header-text">
                <h2>Statistiques</h2>
                <p>Vue d'ensemble de l'activité de votre établissement sur DiploChain</p>
              </div>
              <div className="header-actions">
                <div className="time-filters">
                  <button className={timeFilter === '7days' ? 'active' : ''} onClick={() => setTimeFilter('7days')}>7 jours</button>
                  <button className={timeFilter === '30days' ? 'active' : ''} onClick={() => setTimeFilter('30days')}>30 jours</button>
                  <button className={timeFilter === '6months' ? 'active' : ''} onClick={() => setTimeFilter('6months')}>6 mois</button>
                  <button className={timeFilter === '1year' ? 'active' : ''} onClick={() => setTimeFilter('1year')}>1 an</button>
                </div>
                <button className="btn-outline-grey">
                  <Download size={18} /> Exporter le rapport
                </button>
              </div>
            </header>

            {/* KPI Section */}
            <div className="stats-kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Total diplômes enregistrés</div>
                <div className="kpi-value">1 248</div>
                <div className="kpi-trend positive"><ArrowUpRight size={14} /> +47 ce mois</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total vérifications effectuées</div>
                <div className="kpi-value">3 891</div>
                <div className="kpi-trend positive"><ArrowUpRight size={14} /> +120 cette semaine</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Faux diplômes détectés</div>
                <div className="kpi-value">0</div>
                <div className="kpi-status-badge success"><CheckCircle size={14} /> Système sain</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Disponibilité blockchain</div>
                <div className="kpi-value">99.9%</div>
                <div className="kpi-status-badge success"><Activity size={14} /> Réseau opérationnel</div>
              </div>
            </div>

            {/* Main Charts Row */}
            <div className="stats-main-grid">
              <div className="univ-panel chart-panel">
                <div className="univ-panel-header"><h3>Diplômes enregistrés par mois</h3></div>
                <div className="univ-panel-body" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#1e293b" strokeWidth={3} dot={{ r: 4, fill: '#1e293b' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="univ-panel chart-panel">
                <div className="univ-panel-header"><h3>Répartition par filière</h3></div>
                <div className="univ-panel-body" style={{ height: '300px', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Secondary Row */}
            <div className="stats-secondary-grid">
              <div className="univ-panel chart-panel">
                <div className="univ-panel-header"><h3>Vérifications effectuées par semaine</h3></div>
                <div className="univ-panel-body" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'rgba(30, 41, 59, 0.05)'}} />
                      <Bar dataKey="value" fill="#334155" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="univ-panel table-panel">
                <div className="univ-panel-header"><h3>Filières les plus vérifiées</h3></div>
                <div className="univ-panel-body no-padding">
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>FILIÈRE</th>
                        <th>DIPLÔMES ÉMIS</th>
                        <th>VÉRIFICATIONS</th>
                        <th>TAUX D'AUTHENTICITÉ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Informatique</td><td>398</td><td>1 245</td><td>100% <CheckCircle size={14} color="#22c55e" /></td></tr>
                      <tr><td>Médecine</td><td>302</td><td>987</td><td>100% <CheckCircle size={14} color="#22c55e" /></td></tr>
                      <tr><td>Droit</td><td>224</td><td>743</td><td>100% <CheckCircle size={14} color="#22c55e" /></td></tr>
                      <tr><td>Économie</td><td>178</td><td>521</td><td>100% <CheckCircle size={14} color="#22c55e" /></td></tr>
                      <tr><td>Génie Civil</td><td>146</td><td>395</td><td>100% <CheckCircle size={14} color="#22c55e" /></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'import' && (
          <motion.div key="import" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="univ-panel" style={{ textAlign: 'center', padding: '60px' }}>
              <Upload size={64} color="#f59e0b" style={{ marginBottom: '24px' }} />
              <h2>Importation Collective</h2>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>Importez vos listes d'étudiants via des fichiers Excel ou CSV.</p>
              <Link to="/import" className="univ-btn-primary" style={{ display: 'inline-flex', padding: '14px 28px', textDecoration: 'none' }}>Lancer l'Importation <ArrowRight size={20} /></Link>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="settings-container">
              <header className="settings-header">
                <h2>Paramètres</h2>
                <p>Gérez les informations et la sécurité de votre établissement</p>
              </header>

              <div className="settings-tabs">
                <button className={`settings-tab-btn ${settingsTab === 'profile' ? 'active' : ''}`} onClick={() => setSettingsTab('profile')}>
                  <Building size={18} /> Profil de l'établissement
                </button>
                <button className={`settings-tab-btn ${settingsTab === 'security' ? 'active' : ''}`} onClick={() => setSettingsTab('security')}>
                  <Lock size={18} /> Sécurité et clé privée
                </button>
                <button className={`settings-tab-btn ${settingsTab === 'notifications' ? 'active' : ''}`} onClick={() => setSettingsTab('notifications')}>
                  <Mail size={18} /> Notifications
                </button>
                <button className={`settings-tab-btn ${settingsTab === 'agents' ? 'active' : ''}`} onClick={() => setSettingsTab('agents')}>
                  <UserCog size={18} /> Gestion des agents
                </button>
              </div>

              <div className="settings-grid">
                {/* Main Profile Form */}
                <div className="settings-main">
                  <div className="univ-panel">
                    <div className="univ-panel-header">
                      <h3>Informations de l'établissement</h3>
                    </div>
                    <div className="univ-panel-body">
                      <div className="profile-edit-layout">
                        <div className="logo-upload-section">
                          <div className="logo-preview-wrapper">
                            <div className="logo-placeholder">
                              <img src="https://via.placeholder.com/120?text=LOGO" alt="Logo" />
                              <button className="logo-edit-btn"><Pencil size={14} /></button>
                            </div>
                            <button className="univ-btn-text">Changer le logo</button>
                          </div>
                        </div>

                        <div className="profile-form-grid">
                          <div className="input-row">
                            <div className="input-group-pro">
                              <label>Nom officiel</label>
                              <input 
                                type="text" 
                                value={profile.name} 
                                onChange={(e) => setProfile({...profile, name: e.target.value})} 
                              />
                            </div>
                            <div className="input-group-pro">
                              <label>Sigle</label>
                              <input 
                                type="text" 
                                value={profile.sigle} 
                                onChange={(e) => setProfile({...profile, sigle: e.target.value})} 
                              />
                            </div>
                          </div>

                          <div className="input-row">
                            <div className="input-group-pro">
                              <label>Type</label>
                              <select 
                                value={profile.type} 
                                onChange={(e) => setProfile({...profile, type: e.target.value})}
                              >
                                <option value="public">Université publique</option>
                                <option value="private">Université privée</option>
                                <option value="institute">Institut de recherche</option>
                              </select>
                            </div>
                            <div className="input-group-pro">
                              <label>Région</label>
                              <input 
                                type="text" 
                                value={profile.region} 
                                onChange={(e) => setProfile({...profile, region: e.target.value})} 
                              />
                            </div>
                            <div className="input-group-pro">
                              <label>Ville</label>
                              <input 
                                type="text" 
                                value={profile.ville} 
                                onChange={(e) => setProfile({...profile, ville: e.target.value})} 
                              />
                            </div>
                          </div>

                          <div className="input-group-pro">
                            <label>Adresse</label>
                            <input 
                              type="text" 
                              value={profile.adresse} 
                              onChange={(e) => setProfile({...profile, adresse: e.target.value})} 
                            />
                          </div>

                          <div className="input-group-pro">
                            <label>Site web</label>
                            <input 
                              type="text" 
                              value={profile.website} 
                              onChange={(e) => setProfile({...profile, website: e.target.value})} 
                            />
                          </div>

                          <div className="input-row">
                            <div className="input-group-pro">
                              <label>Email institutionnel</label>
                              <input 
                                type="email" 
                                value={profile.email} 
                                onChange={(e) => setProfile({...profile, email: e.target.value})} 
                              />
                            </div>
                            <div className="input-group-pro">
                              <label>Téléphone</label>
                              <input 
                                type="text" 
                                value={profile.phone} 
                                onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                              />
                            </div>
                          </div>

                          <button 
                            className="univ-btn-primary btn-save" 
                            disabled={isSaving}
                            onClick={handleUpdateProfile}
                          >
                            <Save size={18} /> {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebars */}
                <div className="settings-sidebar">
                  <div className="univ-panel sidebar-panel">
                    <div className="univ-panel-header"><h3>Informations système</h3></div>
                    <div className="univ-panel-body">
                      <div className="sys-info-list">
                        <div className="sys-info-item"><Key size={16} /> <span>Identifiant DiploChain : UO-BF-001</span></div>
                        <div className="sys-info-item"><Calendar size={16} /> <span>Date d'inscription : 15/01/2024</span></div>
                        <div className="sys-info-item success"><CheckCircle size={16} /> <span>Statut : Actif</span></div>
                        <div className="sys-info-item"><Building size={16} /> <span>Accrédité par : Ministère de l'Enseignement Supérieur</span></div>
                        <div className="sys-info-item"><FileText size={16} /> <span>Numéro d'agrément : AGR-2024-BF-0001</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="univ-panel sidebar-panel">
                    <div className="univ-panel-header"><h3>Statut blockchain</h3> <span className="status-badge-green"><ShieldCheck size={12} /> Clé privée active et sécurisée</span></div>
                    <div className="univ-panel-body">
                      <div className="sys-info-list">
                        <div className="sys-info-item"><Globe size={16} /> <span>Réseau : DiploChain Burkina Faso</span></div>
                        <div className="sys-info-item"><History size={16} /> <span>Dernière transaction : Il y a 2 heures</span></div>
                        <div className="sys-info-item"><BarChart3 size={16} /> <span>Total transactions : 1 248</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone-box">
                <h4>Zone de danger</h4>
                <div className="danger-actions">
                  <div className="danger-item">
                    <div className="danger-text">
                      <div className="danger-title"><AlertTriangle size={16} /> Suspendre temporairement le compte</div>
                      <p>Aucun diplôme ne pourra être émis pendant la suspension</p>
                    </div>
                    <button className="btn-outline-danger">Suspendre</button>
                  </div>
                  <div className="danger-item">
                    <div className="danger-text">
                      <div className="danger-title"><Download size={16} /> Exporter toutes les données</div>
                      <p>Téléchargez l'ensemble des diplômes enregistrés au format CSV</p>
                    </div>
                    <button className="btn-outline-grey">Exporter</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default InstitutionDashboard;
