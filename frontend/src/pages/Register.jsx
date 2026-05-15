import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { User, Mail, Lock, UserPlus, ShieldAlert, GraduationCap, Briefcase, ArrowLeft, CheckCircle, Phone, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [role, setRole] = useState('student');
  
  // States for Employer
  const [employerData, setEmployerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  // States for Student
  const [studentStep, setStudentStep] = useState(1); // 1: Matricule, 2: Info & Email, 3: Success
  const [matricule, setMatricule] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmployerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', { ...employerData, role: 'employer' });
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMatricule = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/claim-student/verify', { matricule });
      setStudentInfo(res.data.data);
      setStudentStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Matricule introuvable.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmStudent = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/claim-student/confirm', { 
        matricule, 
        email: studentEmail, 
        phoneNumber: studentPhone 
      });
      setStudentStep(3);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la confirmation.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <button onClick={() => navigate('/')} className="btn-back-global" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <ArrowLeft size={18} /> Accueil
      </button>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card auth-card"
      >
        <div className="auth-header">
          <div className="auth-icon-circle">
            {role === 'student' ? <GraduationCap size={32} /> : <Briefcase size={32} />}
          </div>
          <h1>{role === 'student' && studentStep === 3 ? 'Compte Créé !' : 'Créer un compte'}</h1>
          <p>
            {role === 'student' && studentStep === 1 && 'Étudiants, réclamez votre compte DiploChain via votre matricule.'}
            {role === 'student' && studentStep === 2 && 'Vérifiez vos informations et configurez vos accès.'}
            {role === 'employer' && 'Rejoignez DiploChain en tant qu\'employeur.'}
          </p>
        </div>

        {error && (
          <div className="error-box">
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Hide role selector if student is in step 2 or 3 */}
        {(role === 'employer' || (role === 'student' && studentStep === 1)) && (
          <div className="role-selector">
            <button 
              type="button" 
              className={`role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => { setRole('student'); setError(''); }}
            >
              <GraduationCap size={18} />
              <span>Étudiant</span>
            </button>
            <button 
              type="button" 
              className={`role-btn ${role === 'employer' ? 'active' : ''}`}
              onClick={() => { setRole('employer'); setError(''); }}
            >
              <Briefcase size={18} />
              <span>Employeur</span>
            </button>
          </div>
        )}

        {/* ---------------- EMPLOYER FLOW ---------------- */}
        {role === 'employer' && (
          <form onSubmit={handleEmployerSubmit}>
            <div className="name-grid">
              <div className="input-group">
                <label>Prénom</label>
                <input 
                  type="text" required placeholder="Jean"
                  value={employerData.firstName}
                  onChange={(e) => setEmployerData({...employerData, firstName: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Nom</label>
                <input 
                  type="text" required placeholder="Dupont"
                  value={employerData.lastName}
                  onChange={(e) => setEmployerData({...employerData, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="input-group">
              <label>Adresse Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" required placeholder="recrutement@entreprise.com"
                  value={employerData.email}
                  onChange={(e) => setEmployerData({...employerData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input 
                  type="password" required placeholder="Min. 8 car. (A-z, 1-9)"
                  value={employerData.password}
                  onChange={(e) => setEmployerData({...employerData, password: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte employeur'}
            </button>
          </form>
        )}

        {/* ---------------- STUDENT FLOW ---------------- */}
        {role === 'student' && studentStep === 1 && (
          <form onSubmit={handleVerifyMatricule}>
            <div className="input-group">
              <label>Matricule Étudiant</label>
              <div className="input-wrapper">
                <CreditCard className="input-icon" size={20} />
                <input 
                  type="text" required placeholder="ex: STUD2024001"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                />
              </div>
              <p className="input-hint">Saisissez le matricule attribué par votre établissement.</p>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Vérification...' : 'Vérifier mon identité'}
            </button>
          </form>
        )}

        {role === 'student' && studentStep === 2 && studentInfo && (
          <form onSubmit={handleConfirmStudent}>
            <div className="info-read-only" style={{ background: '#f1f5f9', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10b981" /> Étudiant trouvé
              </h4>
              <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Nom :</strong> {studentInfo.firstName} {studentInfo.lastName}</p>
              <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Filière :</strong> {studentInfo.major}</p>
              <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Matricule :</strong> {matricule}</p>
            </div>

            <div className="input-group">
              <label>Email de connexion (à confirmer)</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" required placeholder="votre.email@exemple.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Numéro de téléphone (optionnel)</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input 
                  type="tel" placeholder="+226 70 00 00 00"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="info-read-only" style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fde68a', fontSize: '0.85rem', color: '#92400e' }}>
              Un mot de passe sécurisé sera généré et envoyé à l'adresse email ci-dessus.
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Confirmation...' : 'Confirmer mon compte'}
            </button>
            <button type="button" onClick={() => setStudentStep(1)} className="btn-link w-full" style={{ marginTop: '12px', textAlign: 'center', display: 'block' }}>
              Retour
            </button>
          </form>
        )}

        {role === 'student' && studentStep === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'inline-flex', background: '#dcfce7', padding: '16px', borderRadius: '50%', marginBottom: '20px' }}>
              <CheckCircle size={48} color="#166534" />
            </div>
            <h3 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Félicitations !</h3>
            <p style={{ color: '#475569', lineHeight: '1.5', marginBottom: '24px' }}>
              Votre compte étudiant a été confirmé avec succès. Un email contenant votre <strong>mot de passe par défaut</strong> a été envoyé à l'adresse :<br/>
              <strong>{studentEmail}</strong>
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary w-full">
              Aller à la page de connexion
            </button>
          </div>
        )}

        {/* Footer for login link - hide if success step */}
        {!(role === 'student' && studentStep === 3) && (
          <p className="auth-footer">
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </p>
        )}
      </motion.div>

      <style>{`
        .auth-page { display: flex; justify-content: center; align-items: center; min-height: 90vh; padding: 40px 0; }
        .auth-card { width: 100%; max-width: 500px; padding: 40px; }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-icon-circle { width: 64px; height: 64px; background: rgba(79, 70, 229, 0.1); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        
        .role-selector { display: flex; gap: 12px; margin-bottom: 24px; }
        .role-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: #f1f5f9; border: 1px solid var(--border-light); border-radius: 12px; color: var(--text-muted); cursor: pointer; transition: all 0.3s ease; }
        .role-btn.active { background: var(--primary); border-color: var(--primary); color: white; }
        
        .name-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .input-group { margin-bottom: 20px; text-align: left; }
        .input-group label { display: block; margin-bottom: 8px; font-size: 0.85rem; font-weight: 500; color: var(--text-muted); }
        .input-hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; }
        .input-wrapper { position: relative; background: white; border: 1px solid var(--border-light); border-radius: 12px; display: flex; align-items: center; padding: 0 16px; }
        input { background: white; border: 1px solid var(--border-light); border-radius: 12px; color: var(--text-main); padding: 12px 16px; flex: 1; outline: none; width: 100%; }
        .input-wrapper input { border: none; padding: 12px 0; }
        .input-icon { color: var(--text-muted); margin-right: 12px; }
        .w-full { width: 100%; justify-content: center; margin-top: 10px; }
        .error-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; padding: 12px; border-radius: 12px; margin-bottom: 24px; display: flex; gap: 10px; align-items: center; font-size: 0.85rem; }
        .auth-footer { margin-top: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem; }
        .auth-footer a { color: var(--primary); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default Register;
