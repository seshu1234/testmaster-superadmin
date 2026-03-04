import axios from "axios";

// Helper to get cookie
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return undefined;
  return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
};

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const normalizedBaseURL = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;

const apiClient = axios.create({
  baseURL: normalizedBaseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getCookie("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
