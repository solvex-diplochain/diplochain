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
        <div className="univ-panel-body" style={{ padding: 0 }}>
          <table className="univ-data-table">
            <thead>
              <tr>
                <th>Candidat</th>
                <th>Diplôme</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Jean Dupont</strong></td>
                <td>Master Informatique</td>
                <td><span className="univ-status-badge registered"><CheckCircle size={14} /> Authentique</span></td>
                <td><button className="univ-nav-item" style={{ padding: '4px', width: 'auto' }}><ExternalLink size={16} /></button></td>
              </tr>
              <tr>
                <td><strong>Marie Curie</strong></td>
                <td>Licence Physique</td>
                <td><span className="univ-status-badge registered"><CheckCircle size={14} /> Authentique</span></td>
                <td><button className="univ-nav-item" style={{ padding: '4px', width: 'auto' }}><ExternalLink size={16} /></button></td>
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
