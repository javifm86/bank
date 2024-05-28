import axios from 'axios';

let token: string | null = null;

const http = axios.create({
  baseURL: 'http://localhost:3000',
});

const setSessionToken = (newToken: string) => {
  token = newToken;
};

http.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
export { setSessionToken };
