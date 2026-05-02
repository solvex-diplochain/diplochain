import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FilePlus, 
  Search, 
  Upload, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  User,
  GraduationCap,
  ShieldCheck,
  FileText,
  Calendar,
  Award
} from 'lucide-react';
import './IssueDiploma.css';

const IssueDiploma = () => {
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    field: '',
    level: 'bachelor',
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'pass',
    description: '',
    creditsEarned: ''
  });
  const [file, setFile] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get('/etudiants');
      setStudents(res.data.data);
    } catch (err) {
      console.error('Error fetching students', err);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append('diplomaFile', file);

    try {
      // 1. Créer le diplôme
      const createRes = await API.post('/diplomes', data);
      const diplomaId = createRes.data.data._id;

      // 2. Émettre sur la blockchain
      const issueRes = await API.post(`/blockchain/issue-diploma/${diplomaId}`);
      
      setSuccessData(issueRes.data.data.diploma);
      setSuccess(true);
      // On n'auto-redirige plus immédiatement pour laisser le temps de copier le hash
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'émission sur la blockchain');
      setStep(3); // Retour à l'étape de révision en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Sélection Étudiant', icon: <User size={18} /> },
    { id: 2, label: 'Détails Académiques', icon: <GraduationCap size={18} /> },
    { id: 3, label: 'Révision & Preuve', icon: <ShieldCheck size={18} /> }
  ];

  if (success) {
    return (
      <div className="container center-content pro-success-view">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="glass-card success-card pro-card-premium"
        >
          <div className="success-icon-wrapper">
             <CheckCircle size={100} color="#10b981" className="main-icon" />
             <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} 
               transition={{ repeat: Infinity, duration: 2 }} 
               className="icon-ring"
             />
          </div>
          <h2>Certification Ancrée !</h2>
          <p>Le diplôme a été enregistré sur la blockchain avec succès. L'empreinte numérique est désormais publique et vérifiable.</p>
          
          <div className="hash-display-box glass">
            <span className="label">Hash de Vérification (ID Unique)</span>
            <code className="blockchain-hash">{successData?.blockchainHash}</code>
            <button 
               className="btn-copy-sm" 
               onClick={() => navigator.clipboard.writeText(successData?.blockchainHash)}
            >
               Copier le Hash
            </button>
          </div>

          <div className="success-actions">
            <button onClick={() => navigate('/dashboard')} className="btn-primary pro-btn-lg">Retour au Dashboard</button>
            <Link to={`/verify/${successData?.blockchainHash}`} className="btn-secondary pro-btn-lg">Vérifier l'Ancrage</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedStudent = students.find(s => s._id === formData.studentId);

  return (
    <div className="issue-page container pro-theme">
      <header className="page-header pro-header-center">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pro-badge-top">Processus d'Émission Sécurisé</motion.span>
        <h1>Émettre un <span className="text-gradient">Diplôme</span> Professionnel</h1>
        <p>Générez une certification infalsifiable ancrée dans la blockchain DiploChain.</p>
      </header>

      <div className="pro-multi-step-container">
        <div className="pro-stepper">
          {steps.map(s => (
            <div key={s.id} className={`step-item ${step >= s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              <div className="step-circle">{step > s.id ? <CheckCircle size={16} /> : s.icon}</div>
              <span>{s.label}</span>
              {s.id < 3 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="pro-form-wrapper glass-card">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="step-content"
              >
                <h3>Étape 1 : Choisir l'Étudiant</h3>
                <div className="input-group pro-group">
                  <label>Rechercher un étudiant inscrit</label>
                  <div className="select-wrapper pro-select">
                    <select 
                      required 
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    >
                      <option value="">-- Sélectionnez un étudiant dans la base --</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.email})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="info-box-glass">
                  <Info size={20} />
                  <p>Si l'étudiant n'est pas dans la liste, vous devez d'abord l'importer via le menu "Importation Masse".</p>
                </div>
                <div className="step-actions">
                  <div />
                  <button className="btn-primary pro-btn" disabled={!formData.studentId} onClick={nextStep}>
                    Suivant <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="step-content"
              >
                <h3>Étape 2 : Détails du Diplôme</h3>
                <div className="pro-grid-2">
                  <div className="input-group pro-group">
                    <label>Intitulé Exact</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Master en Architecture Logicielle"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="input-group pro-group">
                    <label>Filière / Domaine</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Informatique"
                      value={formData.field}
                      onChange={(e) => setFormData({...formData, field: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pro-grid-3">
                  <div className="input-group pro-group">
                    <label>Niveau</label>
                    <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}>
                      <option value="bachelor">Licence / Bachelor</option>
                      <option value="master">Master</option>
                      <option value="phd">Doctorat</option>
                      <option value="certificate">Certificat</option>
                    </select>
                  </div>
                  <div className="input-group pro-group">
                    <label>Mention / Grade</label>
                    <select value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})}>
                      <option value="pass">Passable</option>
                      <option value="merit">Assez Bien / Bien</option>
                      <option value="distinction">Très Bien</option>
                    </select>
                  </div>
                  <div className="input-group pro-group">
                    <label>Date d'émission</label>
                    <input type="date" value={formData.issueDate} onChange={(e) => setFormData({...formData, issueDate: e.target.value})} />
                  </div>
                </div>

                <div className="input-group pro-group">
                  <label>Scan du Diplôme (PDF Obligatoire)</label>
                  <div className="pro-file-upload">
                    <Upload size={32} />
                    <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                    <span>{file ? file.name : "Glissez-déposez le document PDF ici"}</span>
                  </div>
                </div>

                <div className="step-actions">
                  <button className="btn-secondary pro-btn" onClick={prevStep}><ChevronLeft size={18} /> Retour</button>
                  <button className="btn-primary pro-btn" disabled={!formData.title || !file} onClick={nextStep}>
                    Réviser <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="step-content review-step"
              >
                <h3>Étape 3 : Révision Finale</h3>
                <div className="review-card glass">
                  <div className="review-header">
                     <Award size={40} className="pro-icon" />
                     <div className="title-box">
                       <h4>{formData.title}</h4>
                       <span className="subtitle">{formData.level.toUpperCase()} - {formData.field}</span>
                     </div>
                  </div>
                  <div className="review-body">
                    <div className="review-item"><span>Titulaire:</span> <strong>{selectedStudent?.firstName} {selectedStudent?.lastName}</strong></div>
                    <div className="review-item"><span>Email:</span> <strong>{selectedStudent?.email}</strong></div>
                    <div className="review-item"><span>Date:</span> <strong>{new Date(formData.issueDate).toLocaleDateString()}</strong></div>
                    <div className="review-item"><span>Fichier:</span> <strong>{file?.name}</strong></div>
                  </div>
                  <div className="blockchain-notice">
                    <ShieldCheck size={20} />
                    <span>L'émission générera une transaction irréversible sur le réseau.</span>
                  </div>
                </div>

                {error && <div className="error-box pro-style"><AlertTriangle size={20} /> {error}</div>}

                <div className="step-actions">
                  <button className="btn-secondary pro-btn" onClick={prevStep} disabled={loading}><ChevronLeft size={18} /> Retour</button>
                  <button className="btn-primary pro-btn-heavy" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Ancrage Blockchain...' : 'Confirmer & Émettre'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default IssueDiploma;
