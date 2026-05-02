import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, ShieldAlert, Calendar, User, School, Hash, Download, CheckCircle2, XCircle } from 'lucide-react';

const Verify = () => {
  const { hash: urlHash } = useParams();
  const [hash, setHash] = useState(urlHash || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlHash) {
      handleVerify(urlHash);
    }
  }, [urlHash]);

  const handleVerify = async (hashToVerify) => {
    if (!hashToVerify) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Appel à l'API de vérification
      const response = await API.get(`/diplomes/verify/${hashToVerify}`);
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
      <section className="verify-header">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="header-content"
        >
          <h1>Vérification <span className="text-gradient">Blockchain</span></h1>
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="result-container"
          >
            {result.authentique ? (
              <div className="glass-card result-card success">
                <div className="status-header">
                  <CheckCircle2 size={64} className="status-icon" />
                  <div className="status-text">
                    <h2>DIPLÔME AUTHENTIQUE</h2>
                    <p>Ce document a été certifié par l'institution émettrice sur DiploChain.</p>
                  </div>
                </div>

                <div className="diploma-details">
                  <DetailItem icon={<User />} label="Titulaire" value={result.data.studentName} />
                  <DetailItem icon={<School />} label="Institution" value={result.data.institutionName} />
                  <DetailItem icon={<Calendar />} label="Date d'émission" value={new Date(result.data.issueDate).toLocaleDateString()} />
                  <DetailItem icon={<Hash />} label="Numéro Certificat" value={result.data.certificateNumber} />
                </div>

                <div className="blockchain-data">
                  <h3>Données de Preuve</h3>
                  <div className="data-row">
                    <span>Transaction Hash:</span>
                    <code className="hash-code">{result.data.blockchainTxHash}</code>
                  </div>
                  <div className="data-row">
                    <span>Statut On-Chain:</span>
                    <span className="badge-success">Validé</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card result-card failure">
                <div className="status-header">
                  <XCircle size={64} className="status-icon" />
                  <div className="status-text">
                    <h2>DIPLÔME NON RECONNU</h2>
                    <p>Nous n'avons trouvé aucune preuve de ce diplôme sur la blockchain.</p>
                  </div>
                </div>
                <p className="warning-text">Attention : Ce document pourrait être une contrefaçon ou n'a pas encore été enregistré sur la plateforme.</p>
              </div>
            )}
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
          max-width: 800px;
          padding-bottom: 100px;
        }
        .verify-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .verify-header h1 {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        .search-container {
          display: flex;
          padding: 8px;
          gap: 12px;
          margin-top: 32px;
          border-radius: 20px;
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
          color: white;
          font-size: 1.1rem;
          outline: none;
          padding: 12px;
        }
        .result-container {
          margin-top: 40px;
        }
        .result-card {
          padding: 40px;
          border-radius: 32px;
        }
        .result-card.success {
          border-left: 8px solid #10b981;
        }
        .result-card.failure {
          border-left: 8px solid #ef4444;
        }
        .status-header {
          display: flex;
          gap: 24px;
          align-items: center;
          margin-bottom: 40px;
        }
        .success .status-icon { color: #10b981; }
        .failure .status-icon { color: #ef4444; }
        .status-text h2 {
          font-size: 2rem;
          margin-bottom: 4px;
        }
        .diploma-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 40px;
          padding: 24px;
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
        }
        .blockchain-data h3 {
          font-size: 1.2rem;
          margin-bottom: 16px;
          color: var(--text-muted);
        }
        .data-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 0.9rem;
        }
        .hash-code {
          color: var(--primary);
          background: rgba(79, 70, 229, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .badge-success {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 4px 12px;
          border-radius: 50px;
          font-weight: 700;
        }
        .error-message {
          margin-top: 20px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 600px) {
          .diploma-details { grid-template-columns: 1fr; }
          .search-container { flex-direction: column; padding: 16px; }
          .btn-primary { width: 100%; }
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
        color: white;
      }
    `}</style>
  </div>
);

export default Verify;
