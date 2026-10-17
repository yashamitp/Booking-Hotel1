import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const baseURL = rawBaseURL.replace(/\/+$/, "");

const axiosClient = axios.create({
  baseURL,
});

// Attach Clerk session token to every request automatically.
// window.Clerk is available globally once ClerkProvider has loaded.
axiosClient.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // Not logged in — unauthenticated requests will be rejected by backend
    // on protected routes and succeed on public routes.
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

