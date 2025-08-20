import axios, { InternalAxiosRequestConfig } from 'axios';
import refreshToken from './refresh';

const client = axios.create({
  baseURL: import.meta.env.VITE_YAJOBA_SEVER_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.withCredentials = true;
    const accessToken = localStorage.getItem('token'); 
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
        
    if (error.response?.status >= 400 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await refreshToken();
        
        const newAccessToken = localStorage.getItem('token');
        
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.replace("/");
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  },
);

export default client;
