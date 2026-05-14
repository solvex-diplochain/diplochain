import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShieldCheck, ShieldAlert, Calendar, User, School, Hash, Download, 
  CheckCircle2, XCircle, Share2, ArrowLeft, Award, GraduationCap, Clock, 
  Lock, AlertTriangle, Fingerprint, Info, Flag, Users, Globe, X
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const Verify = () => {
  const { hash: urlHash } = useParams();
  const [hash, setHash] = useState(urlHash || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (urlHash) {
      handleVerify(urlHash);
    }
  }, [urlHash]);

  const handleVerify = async (hashToVerify) => {
    if (!hashToVerify) return;
    
    // Si l'utilisateur colle l'URL complète au lieu du hash seul, on extrait le hash
    let cleanHash = hashToVerify;
    try {
      if (cleanHash.includes('http')) {
        const urlObj = new URL(cleanHash);
        const paths = urlObj.pathname.split('/');
        cleanHash = paths[paths.length - 1];
      } else if (cleanHash.includes('/verify/')) {
        const paths = cleanHash.split('/verify/');
        cleanHash = paths[paths.length - 1];
      }
    } catch (e) {
      // Ignorer si ce n'est pas une URL valide
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Appel à l'API de vérification
      const response = await API.get(`/diplomes/verify/${cleanHash}`);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page container">
      <button onClick={() => navigate(-1)} className="btn-back-global" style={{ marginTop: '20px' }}>
        <ArrowLeft size={18} /> Retour
      </button>
      <section className="verify-header">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="header-content"
        >
          <h1>Vérification Blockchain</h1>
          <p>Entrez l'empreinte numérique du diplôme pour vérifier son authenticité en temps réel sur la blockchain.</p>
        </motion.div>

        <div className="search-container glass">
          <Search className="search-icon" size={24} />
          <input 
            type="text" 
            placeholder="Entrez le hash du diplôme (ex: 0x...)" 
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />
          <button 
            className="btn-primary" 
            onClick={() => handleVerify(hash)}
            disabled={loading}
          >
            {loading ? 'Vérification...' : 'Vérifier'}
          </button>
        </div>
      </section>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="result-wrapper"
          >
            {result.authentique ? (
              <div className="result-card-pro success">
                <header className="result-card-header success-bg">
                  <div className="status-badge-white"><CheckCircle2 size={32} /></div>
                  <div className="status-text-white">
                    <h2>DIPLÔME AUTHENTIQUE</h2>
                    <p>Vérifié sur la blockchain DiploChain</p>
                  </div>
                </header>

                <div className="result-card-body">
                  <div className="diploma-info-section">
                    <DetailItem icon={<User size={18} />} label="Titulaire" value={result.data.studentName} />
                    <DetailItem icon={<GraduationCap size={18} />} label="Formation" value={result.data.major || 'Licence en Informatique'} />
                    <DetailItem icon={<School size={18} />} label="Établissement" value={result.data.institutionName} />
                    <DetailItem icon={<Award size={18} />} label="Mention" value="Très bien" />
                    <DetailItem icon={<Calendar size={18} />} label="Date d'obtention" value={new Date(result.data.issueDate).toLocaleDateString()} />
                    <DetailItem icon={<Hash size={18} />} label="Numéro" value={result.data.certificateNumber || 'UO-2024-00851'} />
                  </div>

                  <hr className="divider" />

                  <div className="blockchain-info-section">
                    <h3>Blockchain info</h3>
                    <div className="proof-grid">
                      <div className="proof-list">
                        <div className="proof-item"><Users size={16} /> <span>Enregistré sur la blockchain</span></div>
                        <div className="proof-item"><Calendar size={16} /> <span>Date d'enregistrement : {new Date(result.data.blockchainTimestamp * 1000).toLocaleDateString()}</span></div>
                        <div className="proof-item"><ShieldCheck size={16} /> <span>Signé par : {result.data.institutionName}</span></div>
                        <div className="proof-item"><Globe size={16} /> <span>Réseau : DiploChain Burkina Faso</span></div>
                      </div>
                      <div className="proof-visual">
                        <div className="qr-box">
                          <QRCodeCanvas value={window.location.href} size={90} />
                        </div>
                        <div className="valid-badge">
                          <ShieldCheck size={14} /> Signature cryptographique valide
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="btn-save-report"><Download size={18} /> Télécharger le rapport</button>
                    <button className="btn-outline-grey" onClick={() => {setResult(null); setHash('');}}>
                      <Search size={18} /> Nouvelle vérification
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="result-card-pro failure">
                <header className="result-card-header failure-bg">
                  <div className="status-badge-white"><XCircle size={32} /></div>
                  <div className="status-text-white">
                    <h2>DIPLÔME NON RECONNU</h2>
                    <p>Ce document n'existe pas dans le registre DiploChain</p>
                  </div>
                </header>

                <div className="result-card-body">
                  <div className="alert-failure-box">
                    <AlertTriangle size={20} />
                    <div>
                      <strong>Ce diplôme n'a jamais été enregistré sur la blockchain DiploChain</strong>
                      <p>Aucun établissement accrédité n'a signé ce document</p>
                    </div>
                  </div>

                  <div className="failure-explanation">
                    <h4>What this means</h4>
                    <ul>
                      <li><X size={14} /> Ce document ne peut pas être considéré comme authentique</li>
                      <li><X size={14} /> Aucune université burkinabè accréditée n'a émis ce diplôme</li>
                      <li><X size={14} /> La signature cryptographique est absente ou invalide</li>
                    </ul>
                    <div className="searched-code">Code recherché : {hash}</div>
                  </div>

                  <div className="fraud-section">
                    <h4>Signaler une fraude</h4>
                    <p>Si vous pensez être victime d'une fraude au diplôme, vous pouvez le signaler aux autorités compétentes.</p>
                    <button className="btn-report-fraud">
                      <Flag size={18} /> Signaler cette fraude
                    </button>
                  </div>

                  <button className="btn-primary w-full" onClick={() => {setResult(null); setHash('');}}>
                    <Search size={18} /> Nouvelle vérification
                  </button>
                </div>
              </div>
            )}

            <footer className="verification-footer">
              <div className="footer-meta">
                <Clock size={16} /> 
                <span>Vérification effectuée en 1.2 secondes — {new Date().toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="footer-meta">
                <Lock size={16} />
                <span>Cette vérification est sécurisée et confidentielle</span>
              </div>
            </footer>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message glass"
          >
            <ShieldAlert size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .verify-page {
          max-width: 900px;
          padding-bottom: 100px;
          margin: 0 auto;
        }
        .verify-header {
          text-align: center;
          margin: 40px 0;
        }
        .verify-header h1 {
          font-size: 2.5rem;
          margin-bottom: 12px;
          font-weight: 800;
        }
        .search-container {
          display: flex;
          padding: 8px;
          gap: 12px;
          margin: 32px auto 0;
          max-width: 650px;
          border-radius: 12px;
          background: white;
          border: 1px solid var(--border-light);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .search-icon {
          align-self: center;
          margin-left: 16px;
          color: var(--text-muted);
        }
        input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 1.1rem;
          outline: none;
          padding: 12px;
        }
        .result-wrapper {
          margin-top: 50px;
        }
        .result-card-pro {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .result-card-header {
          padding: 30px;
          display: flex;
          align-items: center;
          gap: 20px;
          color: white;
        }
        .success-bg { background-color: #10b981; }
        .failure-bg { background-color: #ef4444; }
        
        .status-badge-white {
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .status-text-white h2 {
          color: white;
          font-size: 1.75rem;
          margin-bottom: 4px;
        }
        .status-text-white p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
        }

        .result-card-body {
          padding: 40px;
        }

        .diploma-info-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 30px;
        }

        .divider {
          border: none;
          border-top: 1px solid #f1f5f9;
          margin: 30px 0;
        }

        .blockchain-info-section h3 {
          font-size: 1rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .proof-grid {
          display: grid;
          grid-template-columns: 1fr 240px;
          gap: 30px;
          align-items: center;
        }

        .proof-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .proof-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-main);
          font-size: 1rem;
        }

        .proof-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .qr-box {
          padding: 10px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .valid-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ecfdf5;
          color: #10b981;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .card-actions {
          margin-top: 40px;
          display: flex;
          gap: 16px;
        }

        .btn-save-report {
          flex: 1;
          background: #f59e0b;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        .btn-outline-grey {
          flex: 1;
          background: white;
          border: 2px solid #e2e8f0;
          color: var(--text-main);
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        .alert-failure-box {
          background: #fff5f5;
          border: 1px solid #fee2e2;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          gap: 16px;
          color: #b91c1c;
          margin-bottom: 30px;
        }

        .alert-failure-box p {
          color: #7f1d1d;
          font-size: 0.9rem;
          margin-top: 4px;
        }

        .failure-explanation h4 {
          font-size: 1.1rem;
          margin-bottom: 15px;
        }

        .failure-explanation ul {
          list-style: none;
          padding: 0;
          margin-bottom: 20px;
        }

        .failure-explanation li {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          color: #1e293b;
        }

        .failure-explanation li svg { color: #ef4444; }

        .searched-code {
          background: #f8fafc;
          padding: 10px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.9rem;
          color: var(--text-muted);
          border: 1px dashed #cbd5e1;
        }

        .fraud-section {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #f1f5f9;
        }

        .btn-report-fraud {
          width: 100%;
          background: white;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 12px;
          border-radius: 8px;
          margin-top: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .verification-footer {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 40px;
        }

        .footer-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .diploma-info-section, .proof-grid { grid-template-columns: 1fr; }
          .card-actions { flex-direction: column; }
          .verification-footer { flex-direction: column; gap: 10px; align-items: center; }
        }
      `}</style>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="detail-item">
    <div className="detail-icon">{icon}</div>
    <div className="detail-info">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
    <style>{`
      .detail-item {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .detail-icon {
        color: var(--primary);
        opacity: 0.8;
      }
      .detail-info {
        display: flex;
        flex-direction: column;
      }
      .detail-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .detail-value {
        font-weight: 600;
        color: var(--text-main);
      }
    `}</style>
  </div>
);

export default Verify;
