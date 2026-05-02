import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { importerEtudiants } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Users, 
  FileText, 
  Download, 
  Info,
  X,
  ChevronRight
} from 'lucide-react';
import './ImportStudents.css';

const ImportStudents = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Format non supporté. Veuillez utiliser .xlsx, .xls ou .csv');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await importerEtudiants(formData);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'importation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-page container pro-theme-import">
      <header className="page-header pro-header-center">
        <button onClick={() => navigate('/dashboard')} className="btn-back-pro">
          <ArrowLeft size={18} /> Retour au Dashboard
        </button>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pro-badge-top">Outil d'Administration</motion.span>
        <h1>Importation <span className="text-gradient">Collective</span></h1>
        <p>Alimentez votre base de données en masse via des fichiers Excel ou CSV sécurisés.</p>
      </header>

      {!result ? (
        <div className="pro-import-grid">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="glass-card import-instructions pro-card"
          >
            <div className="card-title">
              <FileSpreadsheet size={24} className="text-primary" />
              <h3>Directives de formatage</h3>
            </div>
            <p>Pour une importation sans erreur, assurez-vous que votre fichier respecte la structure suivante :</p>
            <div className="format-list">
              <div className="format-item"><strong>email</strong> <span>Adresse unique (clé primaire)</span></div>
              <div className="format-item"><strong>firstName</strong> <span>Prénom de l'étudiant</span></div>
              <div className="format-item"><strong>lastName</strong> <span>Nom de famille</span></div>
              <div className="format-item"><strong>studentId</strong> <span>Matricule universitaire</span></div>
              <div className="format-item"><strong>major</strong> <span>Filière ou Spécialité</span></div>
            </div>
            <div className="pro-download-template">
               <button className="btn-secondary-sm w-full"><Download size={16} /> Télécharger le modèle .xlsx</button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="glass-card upload-container pro-card"
          >
            <form onSubmit={handleImport} className="upload-form-pro">
              <div 
                className={`pro-drop-zone ${file ? 'has-file' : ''} ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="drop-content">
                  <div className="icon-stack">
                     <Upload size={48} className="upload-icon-pro" />
                     {isDragging && <motion.div layoutId="glow" className="glow-circle" />}
                  </div>
                  <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
                  <div className="drop-zone-text">
                    {file ? (
                      <div className="selected-file-info">
                        <FileText size={32} className="text-primary" />
                        <span className="file-name-pro">{file.name}</span>
                        <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                        <button type="button" className="remove-file" onClick={() => setFile(null)}><X size={16} /></button>
                      </div>
                    ) : (
                      <>
                        <h3>Glissez votre fichier ici</h3>
                        <p>ou cliquez pour parcourir vos documents</p>
                        <span className="formats">Formats acceptés : .XLSX, .XLS, .CSV</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {error && <div className="error-box-pro pulse"><AlertCircle size={20} /> {error}</div>}

              <button type="submit" className="btn-primary-heavy w-full" disabled={loading || !file}>
                {loading ? (
                  <div className="loading-spinner-box">
                    <div className="spinner" />
                    <span>Traitement des données...</span>
                  </div>
                ) : (
                  <>Démarrer l'importation <ChevronRight size={18} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-container-pro">
          <div className="glass-card success-summary-pro">
            <div className="success-header-pro">
               <div className="success-badge"><CheckCircle size={40} /></div>
               <h2>Rapport d'Importation</h2>
               <p>L'opération s'est terminée avec succès. Retrouvez le détail ci-dessous.</p>
            </div>

            <div className="stats-grid-pro">
              <div className="stat-card-mini">
                <span className="label">Total</span>
                <span className="val">{result.total}</span>
              </div>
              <div className="stat-card-mini success">
                <span className="label">Validés</span>
                <span className="val">{result.imported}</span>
              </div>
              <div className="stat-card-mini error">
                <span className="label">Échecs</span>
                <span className="val">{result.errors.length}</span>
              </div>
            </div>

            <AnimatePresence>
              {result.errors.length > 0 && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="error-list-pro">
                  <div className="error-header">
                    <h3><AlertCircle size={18} /> Détails des anomalies</h3>
                    <button className="btn-text-sm">Exporter le log</button>
                  </div>
                  <div className="error-scroll-area">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="error-row-pro">
                        <span className="err-target">{err.email}</span>
                        <span className="err-msg">{err.error}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="result-footer-pro">
              <button onClick={() => navigate('/dashboard')} className="btn-primary-pro">Accéder au Dashboard</button>
              <button onClick={() => setResult(null)} className="btn-secondary-pro">Nouvel Import</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImportStudents;
