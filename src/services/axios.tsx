import axios from 'axios';

// CSRF token cache to avoid multiple API calls
let csrfTokenCache: string | null = null;

// Function to get CSRF token from cookie
const getCSRFTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('_csrf='));
  if (csrfCookie) {
    return csrfCookie.split('=')[1];
  }
  return null;
};

// Function to get CSRF token from API
const getCSRFTokenFromAPI = async (): Promise<string | null> => {
  try {
    const res = await axios.get('http://localhost:3333/csrf-token', {
      withCredentials: true
    });
    return res.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

// Function to refresh CSRF token
export const refreshCSRFToken = async (): Promise<string | null> => {
  try {
    // Clear cache
    csrfTokenCache = null;
    
    // Try to get from cookie first (this is usually the most reliable)
    let token = getCSRFTokenFromCookie();
    
    // If not in cookie, fetch from API
    if (!token) {
      token = await getCSRFTokenFromAPI();
    }
    
    // Cache the token
    csrfTokenCache = token;
    return token;
  } catch (error) {
    console.error('Error refreshing CSRF token:', error);
    return null;
  }
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true, // This is important for CSRF cookies
});

// Add request interceptor to include CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only add CSRF token for POST, PUT, DELETE, PATCH requests
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      // Use cached token if available
      let csrfToken = csrfTokenCache || getCSRFTokenFromCookie();
      
      // If no token available, fetch it
      if (!csrfToken) {
        csrfToken = await refreshCSRFToken();
      }
      
      if (csrfToken) {
        config.headers['CSRF-Token'] = csrfToken;
        config.headers['X-CSRF-Token'] = csrfToken; // Some servers expect this header
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle CSRF token errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If we get a 403 error, it might be a CSRF token issue
    if (error.response?.status === 403) {
      // Try to refresh the CSRF token
      await refreshCSRFToken();
      
      // Retry the original request
      const originalRequest = error.config;
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;