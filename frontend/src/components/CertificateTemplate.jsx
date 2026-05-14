import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ShieldCheck, Award, GraduationCap } from 'lucide-react';
import './CertificateTemplate.css';

const CertificateTemplate = ({ diploma, institution, verificationUrl }) => {
  if (!diploma) return null;

  // Ensure QR code always has a valid non-empty value
  const qrValue = verificationUrl ||
    `${window.location.origin}/verify/${diploma.blockchainHash}` ||
    `${window.location.origin}/verify/DEMO`;

  const studentName = diploma.student
    ? `${diploma.student.firstName || ''} ${diploma.student.lastName || ''}`.trim()
    : 'Étudiant';

  const issueDate = diploma.issueDate
    ? new Date(diploma.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div id="diploma-certificate" className="certificate-container">
      {/* Outer decorative border */}
      <div className="cert-outer-frame">
        <div className="cert-inner-frame">

          {/* Corner ornaments */}
          <div className="corner corner-tl">✦</div>
          <div className="corner corner-tr">✦</div>
          <div className="corner corner-bl">✦</div>
          <div className="corner corner-br">✦</div>

          {/* Header */}
          <div className="cert-header">
            <div className="cert-logo-zone">
              {institution?.logo ? (
                <img src={institution.logo} alt="Logo Institution" className="inst-logo-img" crossOrigin="anonymous" />
              ) : (
                <div className="cert-logo-default">
                  <GraduationCap size={56} color="#1e293b" />
                </div>
              )}
            </div>

            <div className="cert-titles">
              <div className="cert-country">BURKINA FASO</div>
              <div className="cert-ministry">Ministère de l'Enseignement Supérieur</div>
              <div className="cert-org-name">{institution?.name || 'Université DiploChain'}</div>
              {institution?.sigle && <div className="cert-sigle">{institution.sigle}</div>}
            </div>

            <div className="cert-emblem-zone">
              <div className="cert-seal-emblem">
                <Award size={48} color="#b45309" />
                <span>SCEAU OFFICIEL</span>
              </div>
            </div>
          </div>

          {/* Title band */}
          <div className="cert-title-band">
            <div className="cert-title-line"></div>
            <h1 className="cert-main-title">DIPLÔME</h1>
            <div className="cert-title-line"></div>
          </div>
          <div className="cert-subtitle-text">ATTESTATION DE RÉUSSITE ACADÉMIQUE</div>

          {/* Main content */}
          <div className="cert-body">
            <p className="cert-pretext">L'institution certifie que</p>

            <h2 className="cert-student-name">{studentName}</h2>

            <p className="cert-pretext">a satisfait à toutes les exigences requises pour l'obtention du</p>

            <div className="cert-degree-box">
              <h3 className="cert-degree-title">{diploma.title || 'Diplôme Universitaire'}</h3>
              <div className="cert-degree-details">
                {diploma.field && <span className="cert-field-tag">Filière : {diploma.field}</span>}
                {diploma.level && <span className="cert-level-tag">{diploma.level.toUpperCase()}</span>}
                {diploma.grade && <span className="cert-grade-tag">Mention : {diploma.grade}</span>}
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="cert-signatures-row">
            <div className="cert-sig-block">
              <div className="cert-sig-line"></div>
              <span className="cert-sig-title">Le President</span>
              <span className="cert-sig-name">{institution?.name ? `${institution.name.substring(0, 20)}` : ''}</span>
            </div>

            <div className="cert-date-center">
              <span className="cert-date-label">Délivré le</span>
              <span className="cert-date-value">{issueDate}</span>
            </div>

            <div className="cert-sig-block">
              <div className="cert-sig-line"></div>
              <span className="cert-sig-title">Le Secretaire General</span>
              <span className="cert-sig-name">Faculté concernée</span>
            </div>
          </div>

          {/* Security strip — QR code always visible */}
          <div className="cert-security-strip">
            <div className="cert-qr-zone">
              <div className="cert-qr-border">
                <QRCodeCanvas
                  value={qrValue}
                  size={90}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                />
              </div>
              <div className="cert-qr-label">
                <span className="qr-scan-text"> SCANNER POUR VÉRIFIER</span>
                <span className="qr-scan-sub">Vérification blockchain instantanée</span>
              </div>
            </div>

            <div className="cert-hash-zone">
              <div className="cert-hash-header">
                <ShieldCheck size={14} color="#059669" />
                <span>CERTIFIÉ SUR LA BLOCKCHAIN DIPLOCHAIN</span>
              </div>
              <div className="cert-hash-value">
                <span className="hash-label-cert">Hash :</span>
                <code className="hash-code-cert">
                  {diploma.blockchainHash
                    ? diploma.blockchainHash.substring(0, 42) + '...'
                    : 'En cours d\'enregistrement...'}
                </code>
              </div>
              <div className="cert-hash-footer">
                <span> Document infalsifiable & DiploChain Burkina Faso</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
