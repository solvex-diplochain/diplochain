import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';

// Actor-specific dashboards
import StudentDashboard from '../components/dashboards/StudentDashboard';
import InstitutionDashboard from '../components/dashboards/InstitutionDashboard';
import EmployerDashboard from '../components/dashboards/EmployerDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ diplomas: [], institutions: [], stats: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await API.get('/stats');
      
      let extraData = { diplomas: [], institutions: [], students: [] };
      
      if (user?.role === 'admin') {
        const instRes = await API.get('/institutions');
        extraData.institutions = instRes.data.data.institutions;
      }

      if (user?.role === 'institution') {
        const studentsRes = await API.get('/etudiants');
        extraData.students = studentsRes.data.data;
      }
      
      const diplomasRes = await API.get('/diplomes');
      extraData.diplomas = diplomasRes.data.data.diplomas;

      setData({
        stats: statsRes.data.data,
        ...extraData
      });
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleInstitutionStatus = async (id, currentStatus) => {
    try {
      await API.put(`/institutions/${id}`, { isVerified: !currentStatus });
      fetchDashboardData();
    } catch (err) {
      alert('Erreur lors de la modification du statut');
    }
  };

  if (loading) return (
    <div className="container center-loader">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="loader"
      />
      <p>Chargement de votre espace sécurisé...</p>
    </div>
  );

  return (
    <div className={`dashboard-wrapper ${user ? '' : 'container'}`}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {user?.role === 'student' && <StudentDashboard user={user} data={data} />}
        {user?.role === 'institution' && <InstitutionDashboard user={user} data={data} />}
        {user?.role === 'employer' && <EmployerDashboard user={user} data={data} />}
        {user?.role === 'admin' && (
          <AdminDashboard 
            user={user} 
            data={data} 
            onToggleInstitution={toggleInstitutionStatus} 
          />
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
