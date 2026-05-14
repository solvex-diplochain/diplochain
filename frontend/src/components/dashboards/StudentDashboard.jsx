import React, { useState, useRef } from 'react';
import { 
  Award, 
  Bell, 
  Settings, 
  LayoutDashboard,
  CheckCircle,
  Clock,
  ChevronRight,
  Shield,
  FileText,
  Download,
  Share2,
  Eye,
  X,
  User,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DashboardLayout from './DashboardLayout';
import CertificateTemplate from '../CertificateTemplate';

const StudentDashboard = ({ user, data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef(null);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard size={18} /> },
    { id: 'diplomas', label: 'Mes Diplômes', icon: <Award size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  const handleDownloadPDF = async (diploma) => {
    if (!certificateRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Center vertically if needed, but usually A4 landscape fits well for certs
      const yPos = pdf.internal.pageSize.getHeight() > pdfHeight ? (pdf.internal.pageSize.getHeight() - pdfHeight) / 2 : 0;
      
      pdf.addImage(imgData, 'PNG', 0, yPos, pdfWidth, pdfHeight);
      pdf.save(`Diplome_${diploma.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF", error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = (hash) => {
    if (!hash) {
      alert("Ce diplôme n'a pas encore de hash blockchain.");
      return;
    }
    const url = `${window.location.origin}/verify/${hash}`;
    navigator.clipboard.writeText(url);
    alert('Lien de vérification copié dans le presse-papier !');
  };

  const renderOverview = () => (
    <>
      <div className="univ-stats-grid">
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.diplomas?.length || 0}</h3>
            <span className="univ-stat-label">Certifications Total</span>
          </div>
          <div className="univ-stat-icon-mini" style={{ background: '#e0f2fe' }}><Award size={24} color="#0ea5e9" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.diplomas?.filter(d => d.status === 'verified').length || 0}</h3>
            <span className="univ-stat-label">Diplômes Vérifiés</span>
          </div>
          <div className="univ-stat-icon-mini" style={{ background: '#dcfce7' }}><CheckCircle size={24} color="#22c55e" /></div>
        </div>
        <div className="univ-stat-card">
          <div className="univ-stat-info">
            <h3 className="univ-stat-value">{data.diplomas?.filter(d => d.status !== 'verified').length || 0}</h3>
            <span className="univ-stat-label">En attente / Brouillon</span>
          </div>
          <div className="univ-stat-icon-mini" style={{ background: '#fef3c7' }}><Clock size={24} color="#f59e0b" /></div>
        </div>
      </div>

      <div className="univ-panel">
        <div className="univ-panel-header">
          <h2>Diplômes Récents</h2>
          <button 
            className="btn-link" 
            onClick={() => setActiveTab('diplomas')}
            style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Voir tout
          </button>
        </div>
        <div className="univ-panel-body">
          {data.diplomas?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {data.diplomas.slice(0, 3).map(d => (
                <div key={d._id} className="univ-panel" style={{ border: '1px solid #e2e8f0', marginBottom: 0 }}>
                  <div className="univ-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                        <FileText size={24} color="#1e293b" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{d.title}</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>{d.institution?.name || 'Institution inconnue'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        background: d.status === 'verified' ? '#dcfce7' : '#fef3c7',
                        color: d.status === 'verified' ? '#166534' : '#92400e',
                        fontWeight: 600
                      }}>
                        {d.status === 'verified' ? 'Vérifié' : 'En attente'}
                      </span>
                      <button 
                        onClick={() => setSelectedDiploma(d)}
                        className="btn-link" 
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        <Eye size={16} /> Consulter
                      </button>
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

  const renderDiplomas = () => (
    <div className="univ-panel" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div className="univ-panel-header">
        <h2>Tous mes diplômes</h2>
        <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          {data.diplomas?.length || 0} diplômes
        </span>
      </div>
      <div className="univ-panel-body">
         {data.diplomas?.length > 0 ? (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {data.diplomas.map(d => (
              <div key={d._id} style={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.2s',
              }} className="diploma-card">
                
                {/* Header card */}
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <Award size={32} color="#f59e0b" />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.2rem', lineHeight: '1.3' }}>{d.title}</h3>
                    <p style={{ margin: '0 0 4px 0', color: '#475569', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LayoutDashboard size={14} /> {d.institution?.name || 'Institution inconnue'}
                    </p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} /> Émis le: {new Date(d.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Body card */}
                <div style={{ padding: '16px 20px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Niveau:</span>
                    <span style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: 600 }}>{d.level?.toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Mention:</span>
                    <span style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: 600 }}>{d.grade || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Statut Blockchain:</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: d.status === 'verified' ? '#dcfce7' : '#f1f5f9',
                      color: d.status === 'verified' ? '#166534' : '#475569',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {d.status === 'verified' ? <><CheckCircle size={12} /> Vérifié</> : <><Clock size={12} /> En attente</>}
                    </span>
                  </div>
                </div>

                {/* Footer actions */}
                <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                  <button 
                    onClick={() => setSelectedDiploma(d)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', borderRadius: '8px', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <Eye size={18} color="#0ea5e9" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Voir</span>
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(d)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', borderRadius: '8px', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <Download size={18} color="#f59e0b" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>PDF</span>
                  </button>
                  <button 
                    onClick={() => handleShare(d.blockchainHash)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', borderRadius: '8px', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <Share2 size={18} color="#10b981" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Partager</span>
                  </button>
                </div>
              </div>
            ))}
           </div>
         ) : (
           <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
             <FileText size={64} style={{ opacity: 0.2, marginBottom: '24px', margin: '0 auto' }} />
             <h3 style={{ color: '#0f172a', marginBottom: '8px' }}>Aucun diplôme trouvé</h3>
             <p>Vous n'avez pas encore de diplômes enregistrés sur la plateforme DiploChain.</p>
           </div>
         )}
      </div>
    </div>
  );

  const renderNotifications = () => {
    // Generate dummy notifications based on diplomas
    const notifications = data.diplomas?.map(d => ({
      id: d._id,
      title: 'Nouveau diplôme délivré',
      message: `Votre diplôme "${d.title}" a été délivré par ${d.institution?.name || "l'institution"}.`,
      date: new Date(d.issueDate).toLocaleDateString(),
      read: true,
      type: 'diploma'
    })) || [];

    // Add a welcome notification
    notifications.unshift({
      id: 'welcome',
      title: 'Bienvenue sur DiploChain',
      message: 'Votre espace étudiant est prêt. Vous pouvez consulter vos diplômes et les partager en toute sécurité.',
      date: new Date().toLocaleDateString(),
      read: true,
      type: 'system'
    });

    return (
      <div className="univ-panel" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="univ-panel-header"><h2>Notifications</h2></div>
        <div className="univ-panel-body" style={{ padding: 0 }}>
          {notifications.map((notif, idx) => (
            <div key={notif.id} style={{ 
              padding: '20px', 
              borderBottom: idx < notifications.length - 1 ? '1px solid #e2e8f0' : 'none',
              display: 'flex',
              gap: '16px',
              background: notif.read ? '#fff' : '#f0f9ff'
            }}>
              <div style={{ 
                background: notif.type === 'system' ? '#e0e7ff' : '#dcfce7', 
                color: notif.type === 'system' ? '#4f46e5' : '#166534',
                padding: '12px',
                borderRadius: '50%',
                height: 'fit-content'
              }}>
                {notif.type === 'system' ? <Shield size={20} /> : <Award size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, color: '#0f172a' }}>{notif.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{notif.date}</span>
                </div>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="univ-panel" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div className="univ-panel-header"><h2>Mon Profil & Paramètres</h2></div>
      <div className="univ-panel-body" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: '#0ea5e9', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', color: '#0f172a' }}>{user?.firstName} {user?.lastName}</h3>
              <p style={{ margin: 0, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} /> Compte Étudiant Vérifié
              </p>
            </div>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#475569', fontSize: '0.9rem' }}>Prénom</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  value={user?.firstName || ''} 
                  disabled 
                  style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#64748b' }} 
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#475569', fontSize: '0.9rem' }}>Nom de famille</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  value={user?.lastName || ''} 
                  disabled 
                  style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#64748b' }} 
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#475569', fontSize: '0.9rem' }}>Adresse Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#64748b' }} 
                />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: '4px 0 0 0' }}>
                * Les informations de votre profil sont liées à votre identité académique et ne peuvent être modifiées que par votre établissement.
              </p>
            </div>
          </form>
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <div className="univ-panel" style={{ border: '1px solid #e2e8f0', background: '#fff', boxShadow: 'none' }}>
            <div className="univ-panel-header" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#3b82f6" /> Sécurité
              </h3>
            </div>
            <div className="univ-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Key size={18} /> Changer mon mot de passe
              </button>
              <div style={{ marginTop: '16px', padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={16} /> Authentification 2FA
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d', lineHeight: '1.5' }}>
                  L'authentification à deux facteurs n'est pas encore activée. L'activer ajoutera une couche de sécurité supplémentaire.
                </p>
                <button className="btn-primary" style={{ marginTop: '12px', fontSize: '0.85rem', padding: '6px 12px', background: '#22c55e' }}>
                  Activer la 2FA
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <DashboardLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'diplomas' && renderDiplomas()}
      {activeTab === 'notifications' && renderNotifications()}
      {activeTab === 'settings' && renderSettings()}

      {/* Diploma Modal Viewer */}
      {selectedDiploma && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: '#f8fafc',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '1000px',
            maxHeight: '95vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ 
              padding: '16px 24px', 
              borderBottom: '1px solid #e2e8f0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#fff'
            }}>
              <div>
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>Visualisation du diplôme</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>ID: {selectedDiploma.certificateNumber || selectedDiploma._id}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleDownloadPDF(selectedDiploma)}
                  disabled={isDownloading}
                  className="btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', opacity: isDownloading ? 0.7 : 1 }}
                >
                  <Download size={18} /> {isDownloading ? 'Génération...' : 'Télécharger PDF'}
                </button>
                <button 
                  onClick={() => handleShare(selectedDiploma.blockchainHash)}
                  className="btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                >
                  <Share2 size={18} /> Partager
                </button>
                <button 
                  onClick={() => setSelectedDiploma(null)}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#475569',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Modal Body with Certificate */}
            <div style={{ 
              padding: '24px', 
              overflowY: 'auto', 
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              background: '#cbd5e1'
            }}>
              {/* This wrapper is what html2canvas captures */}
              <div ref={certificateRef} style={{ background: 'white', padding: '10px', borderRadius: '4px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <CertificateTemplate 
                  diploma={selectedDiploma} 
                  institution={selectedDiploma.institution} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;

