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
    
    // Safely format Zod/Object/System errors to string for frontend Toasters
    // This prevents "Objects are not valid as a React child" crashes
    if (error.response?.data) {
      const data = error.response.data;
      
      // If server returned an error field
      if (data.error) {
        if (typeof data.error === 'object') {
          if (data.error.name === 'ZodError' && Array.isArray(data.error.issues)) {
             error.response.data.error = data.error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
          } else {
             error.response.data.error = JSON.stringify(data.error);
          }
        }
      } 
      // If server returned a top-level message (Common in Vercel/Node errors)
      else if (data.message && typeof data.message === 'string') {
        error.response.data.error = data.message;
      }
      // If the whole response data is an object with {code, message} but no error key
      else if (typeof data === 'object' && data !== null) {
        error.response.data.error = data.message || JSON.stringify(data);
      }
    } else {
      // Handle Network errors or cases with no response body
      error.message = typeof error.message === 'string' ? error.message : JSON.stringify(error);
    }
    
    return Promise.reject(error);
  }
);