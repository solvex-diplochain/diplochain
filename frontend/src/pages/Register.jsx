import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { User, Mail, Lock, UserPlus, ShieldAlert, GraduationCap, Building, Briefcase, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', formData);
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
            <UserPlus size={32} />
          </div>
          <h1>Créer un compte</h1>
          <p>Rejoignez DiploChain et sécurisez vos titres académiques.</p>
        </div>

        {error && (
          <div className="error-box">
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            <button 
              type="button" 
              className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, role: 'student'})}
            >
              <GraduationCap size={18} />
              <span>Étudiant</span>
            </button>
            <button 
              type="button" 
              className={`role-btn ${formData.role === 'institution' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, role: 'institution'})}
            >
              <Building size={18} />
              <span>Institution</span>
            </button>
            <button 
              type="button" 
              className={`role-btn ${formData.role === 'employer' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, role: 'employer'})}
            >
              <Briefcase size={18} />
              <span>Employeur</span>
            </button>
          </div>

          <div className="name-grid">
            <div className="input-group">
              <label>Prénom</label>
              <input 
                type="text" 
                required 
                placeholder="Jean"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Nom</label>
              <input 
                type="text" 
                required 
                placeholder="Dupont"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Adresse Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                required 
                placeholder="nom@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                required 
                placeholder="Min. 8 car. (A-z, 1-9)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <p className="input-hint">Doit contenir au moins une majuscule, une minuscule et un chiffre.</p>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Création...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="auth-footer">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
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
        .input-group { margin-bottom: 20px; }
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
