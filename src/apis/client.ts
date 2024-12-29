import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_YAJOBA_SEVER_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
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
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  },
);

export default client;
