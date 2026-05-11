import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle, 
  History, 
  Settings, 
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const EmployerDashboard = ({ user, data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
    { id: 'verify', label: 'Vérifier un Diplôme', icon: <ShieldCheck size={18} /> },
    { id: 'history', label: 'Historique des recherches', icon: <History size={18} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  const renderOverview = () => (
    <>
      <div className="univ-stats-grid">
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">24</h3>
            <span className="univ-stat-label">Vérifications ce mois</span>
            <span className="univ-stat-trend positive">+15%</span>
          </div>
          <div className="univ-stat-icon-mini"><TrendingUp size={24} color="#22c55e" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">100%</h3>
            <span className="univ-stat-label">Taux d'authenticité</span>
          </div>
          <div className="univ-stat-icon-mini"><CheckCircle size={24} color="#22c55e" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">Pro</h3>
            <span className="univ-stat-label">Type de compte</span>
          </div>
          <div className="univ-stat-icon-mini"><Briefcase size={24} color="#1e293b" /></div>
        </div>
      </div>

      <div className="univ-panel">
        <div className="univ-panel-header">
          <h2>Recherches Récentes</h2>
        </div>
        <div className="univ-panel-body">
          <table className="univ-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Candidat</th>
                <th style={{ padding: '12px' }}>Diplôme</th>
                <th style={{ padding: '12px' }}>Statut</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock data for now */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}><strong>Jean Dupont</strong></td>
                <td style={{ padding: '12px' }}>Master Informatique</td>
                <td style={{ padding: '12px' }}><span style={{ color: '#22c55e', fontWeight: 600 }}>Authentique</span></td>
                <td style={{ padding: '12px' }}><button style={{ background: 'none', border: 'none', color: '#1e293b', cursor: 'pointer' }}><ExternalLink size={16} /></button></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}><strong>Marie Curie</strong></td>
                <td style={{ padding: '12px' }}>Licence Physique</td>
                <td style={{ padding: '12px' }}><span style={{ color: '#22c55e', fontWeight: 600 }}>Authentique</span></td>
                <td style={{ padding: '12px' }}><button style={{ background: 'none', border: 'none', color: '#1e293b', cursor: 'pointer' }}><ExternalLink size={16} /></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && renderOverview()}
      {['verify', 'history', 'settings'].includes(activeTab) && (
        <div className="univ-panel">
          <div className="univ-panel-header"><h2>{tabs.find(t => t.id === activeTab).label}</h2></div>
          <div className="univ-panel-body"><p>Interface de {tabs.find(t => t.id === activeTab).label} en cours...</p></div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
