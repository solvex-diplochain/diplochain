import React, { useState } from 'react';
import { 
  Users, 
  Building, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  Settings, 
  LayoutDashboard,
  ShieldAlert,
  Activity,
  UserPlus
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const AdminDashboard = ({ user, data, onToggleInstitution }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard size={18} /> },
    { id: 'institutions', label: 'Universités', icon: <Building size={18} /> },
    { id: 'users', label: 'Utilisateurs', icon: <Users size={18} /> },
    { id: 'security', label: 'Sécurité & Audit', icon: <ShieldAlert size={18} /> },
    { id: 'settings', label: 'Configuration', icon: <Settings size={18} /> },
  ];

  const renderOverview = () => (
    <>
      <div className="univ-stats-grid">
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.institutions?.length || 0}</h3>
            <span className="univ-stat-label">Institutions</span>
          </div>
          <div className="univ-stat-icon-mini"><Building size={24} color="#1e293b" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.diplomas?.length || 0}</h3>
            <span className="univ-stat-label">Diplômes Totaux</span>
          </div>
          <div className="univ-stat-icon-mini"><BarChart3 size={24} color="#f59e0b" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">99.9%</h3>
            <span className="univ-stat-label">Uptime Système</span>
          </div>
          <div className="univ-stat-icon-mini"><Activity size={24} color="#22c55e" /></div>
        </div>
      </div>

      <div className="univ-panel">
        <div className="univ-panel-header">
          <h2>Dernières Institutions Inscrites</h2>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}><UserPlus size={16} /> Ajouter</button>
        </div>
        <div className="univ-panel-body" style={{ padding: 0 }}>
          <table className="univ-data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.institutions?.map(inst => (
                <tr key={inst._id}>
                  <td><strong>{inst.name}</strong></td>
                  <td>{inst.email}</td>
                  <td>
                    {inst.isVerified ? (
                      <span className="univ-status-badge registered"><CheckCircle size={14} /> Vérifié</span>
                    ) : (
                      <span className="univ-status-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}><XCircle size={14} /> Non vérifié</span>
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={() => onToggleInstitution(inst._id, inst.isVerified)}
                      className="univ-btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      {inst.isVerified ? 'Révoquer' : 'Approuver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && renderOverview()}
      {['institutions', 'users', 'security', 'settings'].includes(activeTab) && (
        <div className="univ-panel">
          <div className="univ-panel-header"><h2>{tabs.find(t => t.id === activeTab).label}</h2></div>
          <div className="univ-panel-body"><p>Interface d'administration des {tabs.find(t => t.id === activeTab).label}...</p></div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
