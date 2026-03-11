import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach Clerk session token to every request automatically.
// window.Clerk is available globally once ClerkProvider has loaded.
axiosClient.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // Not logged in — unauthenticated requests will be rejected by backend
    // on protected routes and succeed on public routes.
  }
  return config;
});

export default axiosClient;
