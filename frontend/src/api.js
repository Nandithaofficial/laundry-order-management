import axios from "axios";

const API = axios.create({
  baseURL: "https://laundry-order-management-657i.onrender.com/api",
});

export const createOrder = (data) => API.post("/orders", data);
export const getOrders = (params) => API.get("/orders", { params });
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
export const getDashboard = () => API.get("/orders/dashboard");