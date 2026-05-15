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
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  X,
  User,
  GraduationCap,
  Briefcase,
  Settings as SettingsIcon,
  Home,
  Plus
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import AddStudent from './AddStudent';
import StudentList from './StudentList';
import CertificateTemplate from '../CertificateTemplate';
import API from '../../services/api';

const InstitutionDashboard = ({ user, data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsTab, setSettingsTab] = useState('profile');
  const [timeFilter, setTimeFilter] = useState('30days');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [profile, setProfile] = useState({
    name: user?.name || 'Université de Ouagadougou',
    sigle: 'UO',
    type: 'public',
    region: 'Centre',
    ville: 'Ouagadougou',
    adresse: "Avenue de l'Université, Secteur 4",
    website: 'https://www.uo.bf',
    email: 'contact@uo.bf',
    phone: '+226 25 30 XX XX',
    logo: null
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUploadSuccess, setLogoUploadSuccess] = useState('');
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
            phone: inst.phone || '',
            logo: inst.logo || null
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input so we can select the same file again if needed
    e.target.value = '';

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      alert('Format non supporté. Utilisez PNG, JPG, GIF, WEBP ou SVG.');
      return;
    }
    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to backend
    setIsUploadingLogo(true);
    setLogoUploadSuccess('');
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const res = await API.post('/institutions/my-profile/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setProfile(prev => ({ ...prev, logo: res.data.data.logoUrl }));
        setLogoUploadSuccess('Logo mis à jour avec succès !');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'upload du logo');
      setLogoPreview(null);
    } finally {
      setIsUploadingLogo(false);
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
      <div className="univ-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="univ-stat-card-premium">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="kpi-icon-glow glow-gold"><FileText size={20} color="var(--univ-orange)" /></div>
            <span className="univ-stat-trend positive" style={{ fontSize: '11px', fontWeight: 700 }}>+12%</span>
          </div>
          <div>
            <h3 className="univ-stat-value" style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 4px' }}>
              {data?.diplomas?.length || 0}
            </h3>
            <span className="univ-stat-label" style={{ fontSize: '12px', color: 'var(--univ-text-muted)', fontWeight: 600 }}>Total Diplômes Émis</span>
          </div>
        </div>

        <div className="univ-stat-card-premium">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="kpi-icon-glow glow-blue"><Users size={20} color="#3b82f6" /></div>
            <span className="univ-stat-trend positive" style={{ fontSize: '11px', fontWeight: 700 }}>+5%</span>
          </div>
          <div>
            <h3 className="univ-stat-value" style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 4px' }}>
              {data.stats?.totalStudents || 0}
            </h3>
            <span className="univ-stat-label" style={{ fontSize: '12px', color: 'var(--univ-text-muted)', fontWeight: 600 }}>Étudiants Actifs</span>
          </div>
        </div>

        <div className="univ-stat-card-premium">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="kpi-icon-glow glow-green"><ShieldCheck size={20} color="var(--univ-success)" /></div>
            <div className="pulse-dot"></div>
          </div>
          <div>
            <h3 className="univ-stat-value" style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 4px' }}>
              {data.stats?.totalVerified || 0}
            </h3>
            <span className="univ-stat-label" style={{ fontSize: '12px', color: 'var(--univ-text-muted)', fontWeight: 600 }}>Preuves On-Chain</span>
          </div>
        </div>

        <div className="univ-stat-card-premium">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="kpi-icon-glow glow-blue"><Activity size={20} color="#3b82f6" /></div>
            <div style={{ fontSize: '10px', color: 'var(--univ-success)', fontWeight: 800 }}>LIVE</div>
          </div>
          <div>
            <h3 className="univ-stat-value" style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0 4px' }}>99.9%</h3>
            <span className="univ-stat-label" style={{ fontSize: '12px', color: 'var(--univ-text-muted)', fontWeight: 600 }}>Uptime Blockchain</span>
          </div>
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
                    <td><span className="univ-status-badge registered"><CheckCircle size={12} /> {d.status}</span><button className="univ-btn-outline" style={{ padding: '2px 6px', fontSize: '0.7rem', marginLeft: '8px' }} onClick={() => { setSelectedDiploma(d); setShowPreview(true); }}><Award size={12} /> Voir</button></td>
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
                        <td>
                          <button
                            className="univ-btn-outline"
                            style={{ padding: '4px' }}
                            onClick={() => {
                              setSelectedDiploma(d);
                              setShowPreview(true);
                            }}
                          >
                            <ExternalLink size={16} />
                          </button>
                        </td>
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
                      <Legend verticalAlign="bottom" height={36} />
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
                      <Tooltip cursor={{ fill: 'rgba(30, 41, 59, 0.05)' }} />
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
                {/* Main Content Area */}
                <div className="settings-main">
                  {settingsTab === 'profile' && (
                    <div className="univ-panel">
                      <div className="univ-panel-header">
                        <h3>Informations de l'établissement</h3>
                      </div>
                      <div className="univ-panel-body">
                        <div className="profile-edit-layout">
                          <div className="logo-upload-section">
                            <div className="logo-preview-wrapper">
                              <div className="logo-placeholder">
                                {(logoPreview || profile.logo) ? (
                                  <img
                                    src={logoPreview || profile.logo}
                                    alt="Logo Institution"
                                    style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '8px' }}
                                  />
                                ) : (
                                  <div style={{ width: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: '8px', border: '2px dashed #cbd5e1', cursor: 'pointer' }}>
                                    <Upload size={28} color="#94a3b8" />
                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '6px', textAlign: 'center' }}>Aucun logo</span>
                                  </div>
                                )}
                                <label className="logo-edit-btn" htmlFor="logo-file-input" style={{ cursor: 'pointer' }}>
                                  {isUploadingLogo ? '...' : <Pencil size={14} />}
                                </label>
                                <input
                                  id="logo-file-input"
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={handleLogoUpload}
                                />
                              </div>
                              <label
                                htmlFor="logo-file-input"
                                className="univ-btn-text"
                                style={{ cursor: 'pointer', display: 'block', textAlign: 'center', marginTop: '8px' }}
                              >
                                {isUploadingLogo ? 'Envoi en cours...' : 'Changer le logo'}
                              </label>
                              {logoUploadSuccess && (
                                <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                  <CheckCircle size={12} /> {logoUploadSuccess}
                                </div>
                              )}
                              <p style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.4 }}>PNG, JPG ou SVG<br />Max 5 Mo</p>
                            </div>
                          </div>

                          <div className="profile-form-grid">
                            <div className="input-row">
                              <div className="input-group-pro">
                                <label>Nom officiel</label>
                                <input
                                  type="text"
                                  value={profile.name}
                                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                              </div>
                              <div className="input-group-pro">
                                <label>Sigle</label>
                                <input
                                  type="text"
                                  value={profile.sigle}
                                  onChange={(e) => setProfile({ ...profile, sigle: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="input-row">
                              <div className="input-group-pro">
                                <label>Type</label>
                                <select
                                  value={profile.type}
                                  onChange={(e) => setProfile({ ...profile, type: e.target.value })}
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
                                  onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                                />
                              </div>
                              <div className="input-group-pro">
                                <label>Ville</label>
                                <input
                                  type="text"
                                  value={profile.ville}
                                  onChange={(e) => setProfile({ ...profile, ville: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="input-group-pro">
                              <label>Adresse</label>
                              <input
                                type="text"
                                value={profile.adresse}
                                onChange={(e) => setProfile({ ...profile, adresse: e.target.value })}
                              />
                            </div>

                            <div className="input-group-pro">
                              <label>Site web</label>
                              <input
                                type="text"
                                value={profile.website}
                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                              />
                            </div>

                            <div className="input-row">
                              <div className="input-group-pro">
                                <label>Email institutionnel</label>
                                <input
                                  type="email"
                                  value={profile.email}
                                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                />
                              </div>
                              <div className="input-group-pro">
                                <label>Téléphone</label>
                                <input
                                  type="text"
                                  value={profile.phone}
                                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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
                  )}


                      {settingsTab === 'security' && (
                        <div className="security-settings-section">
                          <div className="univ-panel">
                            <div className="univ-panel-header"><h3>Sécurité Blockchain</h3></div>
                            <div className="univ-panel-body">
                              <div className="wallet-card-premium">
                                <div className="wallet-header">
                                  <div className="wallet-status">
                                    <ShieldCheck size={20} color="#10b981" />
                                    <span style={{ marginLeft: '8px', fontWeight: 600, color: '#10b981' }}>Clé institutionnelle active</span>
                                  </div>
                                  <div className="wallet-type" style={{ fontSize: '11px', color: 'var(--univ-text-muted)' }}>HSM (Hardware Secure Module)</div>
                                </div>
                                <div className="wallet-address-box" style={{ marginTop: '20px', padding: '16px', background: 'var(--univ-bg)', borderRadius: '12px', border: '1px solid var(--univ-border)' }}>
                                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--univ-text-muted)', marginBottom: '8px' }}>Adresse du Smart Contract</label>
                                  <div className="address-display" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <code style={{ fontSize: '13px', color: 'var(--univ-navy)', wordBreak: 'break-all' }}>0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>
                                    <button className="copy-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--univ-orange)' }}><FileText size={14} /></button>
                                  </div>
                                </div>
                              </div>

                              <div className="security-options-grid" style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="security-opt-card" style={{ padding: '20px', border: '1px solid var(--univ-border)', borderRadius: '16px' }}>
                                  <h4 style={{ margin: '0 0 8px 0' }}>Double Authentification</h4>
                                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--univ-text-muted)' }}>Ajoutez une couche de sécurité lors de l'émission de diplômes.</p>
                                  <button className="univ-btn-outline" style={{ width: '100%', marginTop: '16px', padding: '10px' }}>Configurer la 2FA</button>
                                </div>
                                <div className="security-opt-card" style={{ padding: '20px', border: '1px solid var(--univ-border)', borderRadius: '16px' }}>
                                  <h4 style={{ margin: '0 0 8px 0' }}>Journal d'Audit</h4>
                                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--univ-text-muted)' }}>Consultez l'historique complet des actions administratives.</p>
                                  <button className="univ-btn-outline" style={{ width: '100%', marginTop: '16px', padding: '10px' }}>Voir les logs</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {settingsTab === 'notifications' && (
                        <div className="notifications-settings-section">
                          <div className="univ-panel">
                            <div className="univ-panel-header"><h3>Préférences de Notification</h3></div>
                            <div className="univ-panel-body">
                              <div className="notification-list">
                                {[
                                  { id: 'emit', title: 'Émission de diplômes', desc: 'Recevoir un rapport après chaque vague d\'émission.' },
                                  { id: 'verify', title: 'Vérifications externes', desc: 'Être alerté lorsqu\'un recruteur vérifie un diplôme.' },
                                  { id: 'fraud', title: 'Alerte de fraude', desc: 'Alerte immédiate en cas de tentative de vérification d\'un faux diplôme.', urgent: true },
                                  { id: 'system', title: 'Mises à jour système', desc: 'Maintenance et nouvelles fonctionnalités.' }
                                ].map(item => (
                                  <div key={item.id} className="notif-setting-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--univ-border)' }}>
                                    <div>
                                      <div style={{ fontWeight: 600, color: item.urgent ? '#ef4444' : 'var(--univ-navy)' }}>{item.title}</div>
                                      <p style={{ fontSize: '0.85rem', color: 'var(--univ-text-muted)', margin: '4px 0 0' }}>{item.desc}</p>
                                    </div>
                                    <div className="toggle-switch">
                                      <input type="checkbox" defaultChecked={true} id={`notif-${item.id}`} />
                                      <label htmlFor={`notif-${item.id}`}></label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {settingsTab === 'agents' && (
                        <div className="agents-settings-section">
                          <div className="univ-panel">
                            <div className="univ-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3>Gestion des Agents</h3>
                              <button className="univ-btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                <Plus size={16} /> Ajouter un agent
                              </button>
                            </div>
                            <div className="univ-panel-body" style={{ padding: 0 }}>
                              <table className="univ-table">
                                <thead>
                                  <tr>
                                    <th>NOM</th>
                                    <th>RÔLE</th>
                                    <th>DERNIÈRE ACTIVITÉ</th>
                                    <th>ACTIONS</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--univ-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>JD</div>
                                        <div>
                                          <div style={{ fontWeight: 600 }}>Jean Dupont</div>
                                          <div style={{ fontSize: '0.75rem', color: 'var(--univ-text-muted)' }}>j.dupont@univ.bf</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td><span className="univ-status-badge">Super Admin</span></td>
                                    <td>Il y a 10 min</td>
                                    <td><button className="btn-icon-grey"><SettingsIcon size={14} /></button></td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--univ-orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>SM</div>
                                        <div>
                                          <div style={{ fontWeight: 600 }}>Sarah Maïga</div>
                                          <div style={{ fontSize: '0.75rem', color: 'var(--univ-text-muted)' }}>s.maiga@univ.bf</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td><span className="univ-status-badge registered">Agent Émetteur</span></td>
                                    <td>Hier</td>
                                    <td><button className="btn-icon-grey"><SettingsIcon size={14} /></button></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
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

      {/* Diploma Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedDiploma && (
          <div className="modal-overlay" onClick={() => setShowPreview(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-content-cert"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-cert">
                <h3>Aperçu du Diplôme</h3>
                <button className="close-btn" onClick={() => setShowPreview(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body-cert">
                <CertificateTemplate
                  diploma={selectedDiploma}
                  institution={profile}
                  verificationUrl={`${window.location.origin}/verify/${selectedDiploma.blockchainHash}`}
                />
              </div>
              <div className="modal-footer-cert">
                <p className="hint">Ce diplôme est certifié sur la blockchain. Le code QR permet une vérification instantanée.</p>
                <button className="univ-btn-primary" onClick={() => window.print()}>
                  <Download size={18} /> Imprimer le Diplôme
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 40px;
          backdrop-filter: blur(5px);
        }
        .modal-content-cert {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .modal-header-cert {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 1px solid #f1f5f9;
        }
        .modal-header-cert h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #1e293b;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: #ef4444;
        }
        .modal-body-cert {
          flex: 1;
          overflow-y: auto;
          padding: 40px;
          background: #f8fafc;
          display: flex;
          justify-content: center;
        }
        .modal-footer-cert {
          padding: 20px 30px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-footer-cert .hint {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }
        
        @media print {
          .dashboard-layout, .modal-overlay, .modal-header-cert, .modal-footer-cert {
            display: none !important;
          }
          .modal-overlay {
            position: relative;
            background: none;
            padding: 0;
          }
          .modal-content-cert {
            box-shadow: none;
            max-height: none;
          }
          .modal-body-cert {
            padding: 0;
            background: white;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default InstitutionDashboard;
