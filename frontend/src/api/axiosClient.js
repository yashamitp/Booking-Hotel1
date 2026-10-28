import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const baseURL = rawBaseURL.replace(/\/+$/, "");

const axiosClient = axios.create({
  baseURL,
});

// Attach Clerk session token and user headers to requests automatically
axiosClient.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};

  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // Continue
  }

  try {
    const user = window.Clerk?.user;
    if (user?.id) {
      config.headers["x-user-id"] = user.id;
      config.headers["x-user-email"] =
        user.primaryEmailAddress?.emailAddress || "";
    }
  } catch {
    // Continue
  }

  return config;
});

// Log API errors to console for easier troubleshooting
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`,
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        `[Network Error] No response from server for ${error.config?.method?.toUpperCase()} ${error.config?.url}. BaseURL: ${baseURL}`
      );
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
