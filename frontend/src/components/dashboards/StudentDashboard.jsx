import React, { useState } from 'react';
import { 
  Award, 
  Bell, 
  Settings, 
  LayoutDashboard,
  CheckCircle,
  Clock,
  ChevronRight,
  Shield,
  FileText
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const StudentDashboard = ({ user, data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard size={18} /> },
    { id: 'diplomas', label: 'Mes Diplômes', icon: <Award size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  const renderOverview = () => (
    <>
      <div className="univ-stats-grid">
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.diplomas?.length || 0}</h3>
            <span className="univ-stat-label">Certifications</span>
          </div>
          <div className="univ-stat-icon-mini"><Award size={24} color="#1e293b" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.diplomas?.filter(d => d.status === 'verified').length || 0}</h3>
            <span className="univ-stat-label">Vérifiés</span>
          </div>
          <div className="univ-stat-icon-mini"><CheckCircle size={24} color="#22c55e" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">0</h3>
            <span className="univ-stat-label">En attente</span>
          </div>
          <div className="univ-stat-icon-mini"><Clock size={24} color="#f59e0b" /></div>
        </div>
      </div>

      <div className="univ-panel">
        <div className="univ-panel-header">
          <h2>Diplômes Récents</h2>
          <button className="btn-link" style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Voir tout</button>
        </div>
        <div className="univ-panel-body">
          {data.diplomas?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {data.diplomas.slice(0, 2).map(d => (
                <div key={d._id} className="univ-panel" style={{ border: '1px solid #e2e8f0', marginBottom: 0 }}>
                  <div className="univ-panel-body" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                      <FileText size={24} color="#1e293b" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{d.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Émis le {new Date(d.issueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <Shield size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>Aucun diplôme enregistré pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'diplomas' && (
        <div className="univ-panel">
          <div className="univ-panel-header"><h2>Tous mes diplômes</h2></div>
          <div className="univ-panel-body">
             {/* List all diplomas */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.diplomas?.map(d => (
                  <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{d.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b' }}>ID: {d._id}</p>
                    </div>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Détails</button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
      {['notifications', 'settings'].includes(activeTab) && (
        <div className="univ-panel">
          <div className="univ-panel-header"><h2>{tabs.find(t => t.id === activeTab).label}</h2></div>
          <div className="univ-panel-body"><p>Interface de gestion des {tabs.find(t => t.id === activeTab).label}...</p></div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
