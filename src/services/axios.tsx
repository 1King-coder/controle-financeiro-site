import axios from 'axios';
// Function to get CSRF token from meta tag or cookie
const getCSRFToken = async (): Promise<string | null> => {
  // Try to get from meta tag first
  const res = await axios.get('http://localhost:3333/csrf-token')
  
  return res.data.csrfToken;
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// Add request interceptor to include CSRF token
axiosInstance.interceptors.request.use(
  (config) => {
    // Only add CSRF token for POST, PUT, DELETE requests
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      getCSRFToken().then(
        (csrfToken) => {
          if (csrfToken) {
            config.headers['CSRF-Token'] = csrfToken;
          }
        }
      );
      
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;