import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Ajouter le token à chaque requête si présent
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentification
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');

// Diplômes
export const enregistrerDiplome = (data) => API.post('/diplomes', data);
export const verifierDiplome = (code) => API.get(`/diplomes/verify/${code}`);
export const getDiplomes = (params) => API.get('/diplomes', { params });

// Étudiants
export const importerEtudiants = (formData) => API.post('/etudiants/import', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const createEtudiant = (data) => API.post('/etudiants', data);
export const getEtudiants = () => API.get('/etudiants');

// Stats
export const getStats = () => API.get('/stats');

export default API;
