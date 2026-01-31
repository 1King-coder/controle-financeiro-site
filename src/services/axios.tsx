import axios from "axios";
import history from "./history";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";
import { googleLogout } from "@react-oauth/google";
const USER_STORAGE_KEY = "auth_user";
// CSRF token cache to avoid multiple API calls
let csrfTokenCache: string | null = null;

// Function to get CSRF token from cookie
const getCSRFTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(";");
  const csrfCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("_csrf="),
  );
  if (csrfCookie) {
    return csrfCookie.split("=")[1];
  }
  return null;
};

// const getConnectionToken = async (): Promise<string | null> => {
//   const res = await axios.get(
//     (process.env.REACT_APP_ENV === "DEV"
//       ? process.env.REACT_APP_DEV_URL
//       : process.env.REACT_APP_PROD_URL) + "/connection-token",
//     {
//       withCredentials: true,
//     },
//   );

//   return res.data.connectionToken;
// };

// Function to get CSRF token from API
const getCSRFTokenFromAPI = async (): Promise<string | null> => {
  try {
    // const connectionToken = await getConnectionToken();
    const res = await axios.get(
      (process.env.REACT_APP_ENV === "DEV"
        ? process.env.REACT_APP_DEV_URL
        : process.env.REACT_APP_PROD_URL) + "/csrf-token",
      {
        withCredentials: true,
        // headers: {
        //   ConAuthorization: connectionToken || "",
        // },
      },
    );

    return res.data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
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
    console.error("Error refreshing CSRF token:", error);
    return null;
  }
};

async function refreshUserToken() {
  const storagedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (storagedUser) {
    const user = JSON.parse(storagedUser);
    try {
      const res = await axios.post(
        (process.env.REACT_APP_ENV === "DEV"
          ? process.env.REACT_APP_DEV_URL
          : process.env.REACT_APP_PROD_URL) + "/usuarios/refresh-token",
        { refreshToken: user.refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const updatedUser = {
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        expiresIn: res.data.expiresIn,
        tokenType: res.data.tokenType,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return res.data.accessToken;
    } catch (error) {
      return null;
    }
  }
  return null;
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_ENV === "DEV"
      ? process.env.REACT_APP_DEV_URL
      : process.env.REACT_APP_PROD_URL,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true, // This is important for CSRF cookies
});

// Add request interceptor to include CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only add CSRF token for POST, PUT, DELETE, PATCH requests
    if (
      ["post", "put", "delete", "patch"].includes(
        config.method?.toLowerCase() || "",
      )
    ) {
      // Use cached token if available
      let csrfToken = csrfTokenCache || getCSRFTokenFromCookie();

      // If no token available, fetch it
      if (!csrfToken) {
        csrfToken = await refreshCSRFToken();
      }

      if (csrfToken) {
        config.headers["CSRF-Token"] = csrfToken;
        config.headers["X-CSRF-Token"] = csrfToken; // Some servers expect this header
      }
    }
    // const connectionToken = await getConnectionToken();
    // if (connectionToken) {
    //   config.headers["ConAuthorization"] = connectionToken;
    // }

    const storagedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storagedUser) {
      const user = JSON.parse(storagedUser);
      if (user && user.accessToken) {
        config.headers["Authorization"] = `Bearer ${user.accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle CSRF token errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If we get a 403 error, it might be a CSRF token issue
    if (
      error.response?.status === 403 &&
      error.response.data?.code === "CSRF_ERROR"
    ) {
      // Try to refresh the CSRF token
      await refreshCSRFToken();

      // Retry the original request
      const originalRequest = error.config;
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        return axiosInstance(originalRequest);
      }
    }
    if (
      error.response?.status === 401 &&
      error.response.data?.code === "INVALID_TOKEN"
    ) {
      const newAccessToken = await refreshUserToken();
      if (newAccessToken) {
        const originalRequest = error.config;
        if (originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      }
      localStorage.removeItem(USER_STORAGE_KEY);
      googleLogout();
      history.replace("/login");
      window.location.reload();
      toast.info("Sua sessão expirou. Por favor, faça login novamente.");
      const originalRequest = error.config;
      originalRequest.data = [];
      return Promise.resolve(originalRequest);
    }

    if (
      error.response?.status === 401 &&
      error.response.data?.code === "NO_TOKEN"
    ) {
      localStorage.removeItem(USER_STORAGE_KEY);
      history.push("/login");
      window.location.reload();
      toast.info("Sua sessão expirou. Por favor, faça login novamente.");
      const originalRequest = error.config;
      originalRequest.data = [];
      return Promise.resolve(originalRequest);
    }

    if (error.response.data.code === "INVALID_REFRESH_TOKEN") {
      localStorage.removeItem(USER_STORAGE_KEY);
      history.push("/login");
      Promise.resolve(error.config);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
