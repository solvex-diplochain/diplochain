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
        <div className="univ-panel-body">
          <table className="univ-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Nom</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Statut</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.institutions?.map(inst => (
                <tr key={inst._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px' }}><strong>{inst.name}</strong></td>
                  <td style={{ padding: '12px' }}>{inst.email}</td>
                  <td style={{ padding: '12px' }}>
                    {inst.isVerified ? (
                      <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Vérifié</span>
                    ) : (
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Non vérifié</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => onToggleInstitution(inst._id, inst.isVerified)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '0.75rem' }}
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
