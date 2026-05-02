import React from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { CheckCircle, Share2, Download } from 'lucide-react';

export const StatCard = ({ icon, label, value }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card">
    <div className="stat-icon-wrapper">{icon}</div>
    <div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
    <style>{`
      .stat-card { display: flex; align-items: center; gap: 20px; padding: 24px; }
      .stat-icon-wrapper { width: 50px; height: 50px; background: rgba(255,255,255,0.03); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
      .stat-value { font-size: 1.8rem; font-weight: 800; }
      .stat-label { font-size: 0.85rem; color: var(--text-muted); }
    `}</style>
  </motion.div>
);

export const DiplomaCard = ({ diploma }) => (
  <motion.div whileHover={{ y: -10 }} className="glass-card diploma-card">
    <div className="card-top">
      <div>
        <span className="inst-name">{diploma.institution?.name}</span>
        <h3>{diploma.title}</h3>
      </div>
      <div className="qr-box">
        <QRCodeSVG value={`http://localhost:5173/verify/${diploma.blockchainHash}`} size={60} bgColor="transparent" fgColor="white" />
      </div>
    </div>
    <div className="card-meta">
      <div className="meta-item"><span>Candidat</span><strong>{diploma.student?.firstName} {diploma.student?.lastName}</strong></div>
      <div className="meta-item"><span>Hash Blockchain</span><strong className="hash-text">{diploma.blockchainHash?.substring(0, 10)}...</strong></div>
    </div>
    <div className="card-footer">
      <Link to={`/verify/${diploma.blockchainHash}`} className="btn-verify">
        <CheckCircle size={16} /> Vérifié On-Chain
      </Link>
      <div className="actions">
        <button className="btn-circle"><Share2 size={16} /></button>
        <button className="btn-circle"><Download size={16} /></button>
      </div>
    </div>
    <style>{`
      .diploma-card { padding: 30px; display: flex; flex-direction: column; gap: 20px; }
      .card-top { display: flex; justify-content: space-between; }
      .inst-name { font-size: 0.75rem; color: var(--primary); font-weight: 800; }
      h3 { font-size: 1.3rem; margin-top: 4px; }
      .qr-box { padding: 8px; background: rgba(255,255,255,0.05); border-radius: 12px; }
      .card-meta { display: flex; flex-direction: column; gap: 12px; }
      .meta-item { display: flex; justify-content: space-between; font-size: 0.9rem; }
      .meta-item span { color: var(--text-muted); }
      .hash-text { font-family: monospace; font-size: 0.8rem; }
      .card-footer { display: flex; justify-content: space-between; align-items: center; }
      .btn-verify { display: flex; align-items: center; gap: 8px; color: #10b981; font-weight: 700; text-decoration: none; font-size: 0.85rem; }
      .btn-circle { background: rgba(255,255,255,0.05); border: none; color: var(--text-muted); padding: 8px; border-radius: 50%; cursor: pointer; }
    `}</style>
  </motion.div>
);
