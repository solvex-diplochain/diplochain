import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  ArrowRight, 
  GraduationCap, 
  Building, 
  Briefcase, 
  ShieldAlert,
  Search,
  Upload,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <span className="badge">Blockchain DiploChain</span>
            <h1>La confiance académique ancrée dans la <span className="text-gradient">Blockchain</span></h1>
            <p>Une plateforme décentralisée pour émettre, stocker et vérifier des diplômes infalsifiables en quelques secondes.</p>
            <div className="hero-actions">
              <Link to="/verify" className="btn-primary">
                Vérifier un Diplôme <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="btn-secondary">Démarrer maintenant</Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hero-image"
          >
            <div className="abstract-shape float"></div>
            <div className="glass-card main-visual">
              <ShieldCheck size={100} className="visual-icon" />
              <div className="visual-stats">
                <div className="stat">
                  <span className="stat-val">100%</span>
                  <span className="stat-label">Inviolable</span>
                </div>
                <div className="stat">
                  <span className="stat-val">Sec</span>
                  <span className="stat-label">Vérification</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="quick-stats glass">
        <div className="container stats-container">
          <div className="stat-box"><strong>500+</strong> <span>Universités</span></div>
          <div className="stat-box"><strong>10k+</strong> <span>Diplômes Émis</span></div>
          <div className="stat-box"><strong>0</strong> <span>Falsifications</span></div>
          <div className="stat-box"><strong>24/7</strong> <span>Disponibilité</span></div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Comment ça <span className="text-gradient">marche</span> ?</h2>
            <p>Un processus simple pour une sécurité maximale.</p>
          </div>
          <div className="steps-grid">
            <StepCard icon={<Upload />} num="01" title="Émission" desc="L'université uploade le diplôme et génère un hash unique." />
            <StepCard icon={<Lock />} num="02" title="Ancrage" desc="Le hash est enregistré sur la blockchain DiploChain." />
            <StepCard icon={<Search />} num="03" title="Vérification" desc="Les employeurs vérifient l'authenticité via le hash ou QR code." />
          </div>
        </div>
      </section>

      {/* 4 Acteurs Section */}
      <section className="actors-section">
        <div className="container">
          <div className="section-header">
            <h2>Une plateforme pour <span className="text-gradient">tous</span></h2>
          </div>
          <div className="actors-grid">
            <ActorCard icon={<GraduationCap />} title="Étudiants" desc="Gérez vos diplômes à vie et partagez-les en un clic." />
            <ActorCard icon={<Building />} title="Universités" desc="Émettez des titres infalsifiables et réduisez vos coûts." />
            <ActorCard icon={<Briefcase />} title="Employeurs" desc="Vérifiez instantanément les compétences des candidats." />
            <ActorCard icon={<ShieldAlert />} title="Admin" desc="Supervisez le réseau et validez les institutions." />
          </div>
        </div>
      </section>

      <style>{`
        .hero { min-height: 70vh; display: flex; align-items: center; position: relative; }
        .hero-content { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; align-items: center; }
        .badge { display: inline-block; padding: 6px 16px; background: rgba(79, 70, 229, 0.1); border: 1px solid var(--primary); border-radius: 50px; color: var(--primary); font-size: 0.8rem; font-weight: 700; margin-bottom: 24px; }
        h1 { font-size: 4rem; line-height: 1.1; margin-bottom: 24px; font-weight: 800; }
        .hero-text p { font-size: 1.2rem; color: var(--text-muted); margin-bottom: 40px; }
        .hero-actions { display: flex; gap: 20px; }
        
        .main-visual { width: 350px; height: 350px; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; }
        .visual-icon { color: var(--primary); margin-bottom: 30px; filter: drop-shadow(0 0 15px var(--primary-glow)); }
        .visual-stats { display: flex; gap: 30px; }
        .stat { text-align: center; }
        .stat-val { display: block; font-size: 1.5rem; font-weight: 800; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
        .abstract-shape { position: absolute; width: 400px; height: 400px; background: var(--gradient-accent); filter: blur(80px); opacity: 0.2; border-radius: 50%; top: -20px; right: -20px; }
        
        .quick-stats { margin-top: -40px; position: relative; z-index: 10; padding: 30px 0; border-radius: 0; border-left: none; border-right: none; }
        .stats-container { display: flex; justify-content: space-around; }
        .stat-box { display: flex; flex-direction: column; align-items: center; }
        .stat-box strong { font-size: 1.8rem; color: white; }
        .stat-box span { color: var(--text-muted); font-size: 0.9rem; }
        
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-header h2 { font-size: 3rem; margin-bottom: 16px; }
        
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .actors-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        
        @media (max-width: 1024px) {
          .hero-content { grid-template-columns: 1fr; text-align: center; }
          .hero-actions { justify-content: center; }
          .hero-image { display: none; }
          .actors-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

const StepCard = ({ icon, num, title, desc }) => (
  <div className="glass-card step-card">
    <div className="step-num">{num}</div>
    <div className="step-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <style>{`
      .step-card { padding: 40px; text-align: center; position: relative; }
      .step-num { position: absolute; top: 20px; right: 20px; font-size: 2rem; font-weight: 900; opacity: 0.1; }
      .step-icon { width: 64px; height: 64px; background: rgba(79, 70, 229, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 24px; }
      h3 { margin-bottom: 12px; }
      p { color: var(--text-muted); font-size: 0.95rem; }
    `}</style>
  </div>
);

const ActorCard = ({ icon, title, desc }) => (
  <motion.div whileHover={{ y: -5 }} className="glass-card actor-card">
    <div className="actor-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <style>{`
      .actor-card { padding: 30px; text-align: center; }
      .actor-icon { font-size: 2rem; color: var(--primary); margin-bottom: 16px; display: flex; justify-content: center; }
      h3 { font-size: 1.2rem; margin-bottom: 10px; }
      p { font-size: 0.85rem; color: var(--text-muted); }
    `}</style>
  </motion.div>
);

export default Home;
