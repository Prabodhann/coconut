import axios from 'axios';
import { url } from '../assets/assets';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_ROLE_KEY = 'admin_role';

const api = axios.create({ baseURL: url });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const saveAdminSession = (token: string, role: string) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_ROLE_KEY, role);
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_ROLE_KEY);
};

export const getAdminSession = () => ({
  token: localStorage.getItem(ADMIN_TOKEN_KEY),
  role: localStorage.getItem(ADMIN_ROLE_KEY),
});

export default api;
