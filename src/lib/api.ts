import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

// Use relative path '/api' to avoid CORS issues and leverage Vite proxy in dev / Nginx in prod
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    
    // Safely format Zod/Object errors to string for frontend Toasters
    if (error.response?.data?.error && typeof error.response.data.error === 'object') {
      const errObj = error.response.data.error;
      if (errObj.name === 'ZodError' && Array.isArray(errObj.issues)) {
        error.response.data.error = errObj.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
      } else {
        error.response.data.error = JSON.stringify(errObj);
      }
    }
    
    return Promise.reject(error);
  }
);