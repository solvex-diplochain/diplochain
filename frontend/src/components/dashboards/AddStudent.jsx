import React, { useState } from 'react';
import { createEtudiant } from '../../services/api';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  User, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const AddStudent = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    major: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createEtudiant(formData);
      setSuccess(true);
      if (onStudentAdded) onStudentAdded();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        major: '',
        password: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      <div className="glass-card pro-card">
        <div className="card-header-pro">
          <div className="icon-badge"><UserPlus size={24} /></div>
          <div>
            <h3>Nouvel Étudiant</h3>
            <p>Enregistrez manuellement un étudiant dans votre base académique.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pro-form">
          <div className="pro-grid-2">
            <div className="form-group pro-group">
              <label>Prénom</label>
              <div className="input-with-icon">
                <User size={18} />
                <input 
                  type="text" 
                  required 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="Ex: Jean"
                />
              </div>
            </div>
            <div className="form-group pro-group">
              <label>Nom</label>
              <div className="input-with-icon">
                <User size={18} />
                <input 
                  type="text" 
                  required 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Ex: Dupont"
                />
              </div>
            </div>
          </div>

          <div className="form-group pro-group">
            <label>Email Académique</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="jean.dupont@univ.bf"
              />
            </div>
          </div>

          <div className="pro-grid-2">
            <div className="form-group pro-group">
              <label>Matricule / ID Étudiant</label>
              <div className="input-with-icon">
                <GraduationCap size={18} />
                <input 
                  type="text" 
                  required 
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  placeholder="Ex: 2023-JKZ-001"
                />
              </div>
            </div>
            <div className="form-group pro-group">
              <label>Filière / Spécialité</label>
              <div className="input-with-icon">
                <BookOpen size={18} />
                <input 
                  type="text" 
                  required 
                  value={formData.major}
                  onChange={(e) => setFormData({...formData, major: e.target.value})}
                  placeholder="Ex: Informatique"
                />
              </div>
            </div>
          </div>

          <div className="form-group pro-group">
            <label>Mot de passe (optionnel)</label>
            <div className="input-with-icon">
              <ShieldCheck size={18} />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Par défaut: DefaultPass123!"
              />
            </div>
          </div>

          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-msg-pro"><AlertCircle size={16} /> {error}</motion.div>}
          {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="success-msg-pro"><CheckCircle size={16} /> Étudiant enregistré avec succès !</motion.div>}

          <button type="submit" className="btn-primary pro-btn-heavy w-full" disabled={loading}>
            {loading ? 'Traitement...' : <><UserPlus size={18} /> Enregistrer l'étudiant</>}
          </button>
        </form>
      </div>

      <style>{`
        .add-student-container { max-width: 800px; margin: 0 auto; }
        .card-header-pro { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
        .icon-badge { width: 50px; height: 50px; background: #f1f5f9; color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .card-header-pro h3 { font-size: 1.5rem; margin-bottom: 4px; color: var(--primary); }
        .card-header-pro p { color: var(--text-muted); font-size: 0.9rem; }

        .pro-form { display: flex; flex-direction: column; gap: 24px; }
        .pro-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .pro-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon svg { position: absolute; left: 16px; color: var(--text-muted); pointer-events: none; }
        .input-with-icon input { width: 100%; padding: 14px 14px 14px 48px; background: white; border: 1px solid var(--border-light); border-radius: 14px; color: var(--text-main); transition: all 0.3s; }
        .input-with-icon input:focus { border-color: var(--secondary); background: white; outline: none; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1); }

        .error-msg-pro { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 12px 16px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
        .success-msg-pro { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 12px 16px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
        
        @media (max-width: 600px) {
          .pro-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AddStudent;
