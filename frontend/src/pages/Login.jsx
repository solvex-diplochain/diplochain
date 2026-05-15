import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.');
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
            <LogIn size={32} />
          </div>
          <h1>Bon retour !</h1>
          <p>Connectez-vous pour gérer vos diplômes.</p>
        </div>

        {error && (
          <div className="error-box">
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Adresse Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                required 
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="auth-footer">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </motion.div>

      <style>{`
        .auth-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
        .auth-card { width: 100%; max-width: 500px; padding: 40px; }
        .auth-header { text-align: center; margin-bottom: 24px; }
        .auth-icon-circle { width: 56px; height: 56px; background: rgba(79, 70, 229, 0.1); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
        
        .input-wrapper { display: flex; align-items: center; border: 1px solid var(--border-light); border-radius: 12px; padding: 0 16px; background: white; }
        .input-wrapper:focus-within { border-color: var(--secondary); box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1); }
        .input-icon { color: var(--text-muted); margin-right: 12px; }
        input {
          background: transparent;
          border: none;
          color: var(--text-main);
          padding: 14px 0;
          flex: 1;
          outline: none;
        }
        .w-full { width: 100%; justify-content: center; margin-top: 10px; }
        .error-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 0.9rem;
        }
        .auth-footer {
          margin-top: 32px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .auth-footer a { color: var(--primary); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default Login;
