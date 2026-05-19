import axios from "axios";

const api = axios.create({
  // Sesuaikan dengan URL server Laravel lo
  baseURL: "http://127.0.0.1:8000/api",
});

// Otomatis tempelkan token ke Header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;