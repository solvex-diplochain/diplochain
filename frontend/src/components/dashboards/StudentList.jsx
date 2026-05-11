import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Users, 
  User, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Filter, 
  ChevronRight,
  MoreVertical,
  ExternalLink
} from 'lucide-react';

const StudentList = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMajor, setFilterMajor] = useState('All');

  const filteredStudents = students?.filter(student => {
    const matchesSearch = 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentProfile?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMajor = filterMajor === 'All' || student.studentProfile?.major === filterMajor;

    return matchesSearch && matchesMajor;
  }) || [];

  const majors = ['All', ...new Set(students?.map(s => s.studentProfile?.major).filter(Boolean))];

  return (
    <div className="student-list-container">
      <div className="univ-panel">
        <div className="univ-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={20} className="text-primary" />
            <h3 style={{ margin: 0 }}>Répertoire des Étudiants</h3>
            <span className="univ-badge-count">{filteredStudents.length}</span>
          </div>

          <div className="search-filter-group" style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px', justifyContent: 'flex-end' }}>
            <div className="pro-search-input" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" 
                placeholder="Nom, matricule, email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '10px', outline: 'none' }}
              />
            </div>
            <div className="pro-select-wrapper" style={{ position: 'relative' }}>
               <select 
                value={filterMajor}
                onChange={(e) => setFilterMajor(e.target.value)}
                style={{ padding: '10px 32px 10px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', outline: 'none', appearance: 'none', background: 'white' }}
               >
                 {majors.map(m => <option key={m} value={m}>{m === 'All' ? 'Toutes les filières' : m}</option>)}
               </select>
               <Filter size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        <div className="univ-panel-body" style={{ padding: 0 }}>
          {filteredStudents.length > 0 ? (
            <div className="table-responsive">
              <table className="univ-data-table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Matricule</th>
                    <th>Filière</th>
                    <th>Email</th>
                    <th>Date d'Inscription</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => (
                    <motion.tr 
                      key={student._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="avatar-mini">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{student.firstName} {student.lastName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Statut: Actif</div>
                          </div>
                        </div>
                      </td>
                      <td><code>{student.studentProfile?.studentId}</code></td>
                      <td>
                        <span className="major-tag">{student.studentProfile?.major}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem' }}>
                          <Mail size={14} /> {student.email}
                        </div>
                      </td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button className="univ-btn-icon" title="Détails"><ExternalLink size={16} /></button>
                          <button className="univ-btn-icon" title="Plus"><MoreVertical size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
              <Users size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
              <h3>Aucun étudiant trouvé</h3>
              <p>Essayez de modifier vos critères de recherche ou vos filtres.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .student-list-container {
          width: 100%;
        }
        .univ-badge-count {
          background: var(--secondary);
          color: white;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 700;
        }
        .avatar-mini {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          color: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          border: 1px solid #e2e8f0;
        }
        .major-tag {
          background: #eef2ff;
          color: #4338ca;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
          white-space: nowrap;
        }
        .univ-btn-icon {
          background: none;
          border: 1px solid #e2e8f0;
          color: #64748b;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .univ-btn-icon:hover {
          background: #f8fafc;
          border-color: var(--secondary);
          color: var(--secondary);
        }
        .table-responsive {
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default StudentList;
