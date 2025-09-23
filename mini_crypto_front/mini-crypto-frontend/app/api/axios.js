import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // адрес твоего Django backend
});

export const authHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default api;