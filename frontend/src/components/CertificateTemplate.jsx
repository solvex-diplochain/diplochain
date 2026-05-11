import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ShieldCheck, Award, GraduationCap } from 'lucide-react';
import './CertificateTemplate.css';

const CertificateTemplate = ({ diploma, institution, verificationUrl }) => {
  if (!diploma) return null;

  return (
    <div id="diploma-certificate" className="certificate-container">
      <div className="certificate-border">
        <div className="certificate-inner-border">
          {/* Header */}
          <div className="cert-header">
            <div className="cert-logo">
              <GraduationCap size={60} color="#1e293b" />
            </div>
            <div className="cert-title-section">
              <h1>DIPLÔME D'EXCELLENCE</h1>
              <h3>ATTESTATION DE RÉUSSITE ACADÉMIQUE</h3>
            </div>
          </div>

          {/* Content */}
          <div className="cert-content">
            <p className="cert-intro">L'institution</p>
            <h2 className="cert-institution-name">{institution?.name || 'Université DiploChain'}</h2>
            <p className="cert-intro">certifie que</p>
            <h2 className="cert-student-name">
              {diploma.student?.firstName} {diploma.student?.lastName}
            </h2>
            <p className="cert-text">
              a complété avec succès les exigences requises pour l'obtention du
            </p>
            <h3 className="cert-degree-title">{diploma.title}</h3>
            <p className="cert-field">Filière : {diploma.field}</p>
          </div>

          {/* Footer / Verification Area */}
          <div className="cert-footer">
            <div className="cert-signatures">
              <div className="signature-box">
                <div className="sig-line"></div>
                <span>Le Recteur</span>
              </div>
              <div className="seal-box">
                <div className="cert-seal">
                  <Award size={40} color="#b45309" />
                  <span className="seal-text">SCEAU OFFICIEL</span>
                </div>
              </div>
              <div className="signature-box">
                <div className="sig-line"></div>
                <span>Le Doyen</span>
              </div>
            </div>

            <div className="cert-blockchain-info">
              <div className="qr-section">
                <QRCodeCanvas 
                  value={verificationUrl} 
                  size={120} 
                  level="H"
                  includeMargin={true}
                />
                <span className="qr-hint">Scanner pour vérifier</span>
              </div>
              <div className="blockchain-badge">
                <div className="badge-header">
                  <ShieldCheck size={20} />
                  <span>SÉCURISÉ PAR BLOCKCHAIN</span>
                </div>
                <div className="hash-display">
                  <span className="hash-label">ID Blockchain :</span>
                  <code className="hash-value">{diploma.blockchainHash}</code>
                </div>
                <p className="cert-date">Délivré le : {new Date(diploma.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
