import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = () => {
  return api.get("/users");
};

export const getMessages = (recipientId) => {
  return api.get(`/messages/${recipientId}`);
};

export const sendMessage = (receiverId, message) => {
  api.post("/messages", { receiverId, message });
};

export default api;
