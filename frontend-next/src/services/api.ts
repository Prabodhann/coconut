import axios from "axios";
import { CONSTANTS } from "@/constants";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

const adminApi = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

adminApi.interceptors.request.use((config) => {
  const token =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem("admin_token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const FoodService = {
  getFoodList: () => api.get("/api/food/list"),
};

export const CartService = {
  getCart: () => api.post("/api/cart/get", {}),
  addToCart: (itemId: string) => api.post("/api/cart/add", { itemId }),
  removeFromCart: (itemId: string) => api.post("/api/cart/remove", { itemId }),
};

export const UserService = {
  login: (email: string, password: string) =>
    api.post("/api/user/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/api/user/register", { name, email, password }),
  profile: () => api.get("/api/user/profile"),
  updateProfile: (data: unknown) => api.put("/api/user/profile", data),
};

export const OrderService = {
  place: (data: unknown) => api.post("/api/order/place", data),
  verify: (success: string | null, orderId: string | null) =>
    api.post("/api/order/verify", { success, orderId }),
  mine: () => api.post("/api/order/userorders", {}),
  list: () => api.get("/api/order/list"),
  updateStatus: (orderId: string, status: string) =>
    api.post("/api/order/status", { orderId, status }),
};

export const AdminFoodService = {
  add: (data: FormData) => adminApi.post("/api/food/add", data),
  update: (data: unknown) => adminApi.post("/api/food/edit", data),
  remove: (id: string) => adminApi.post("/api/food/remove", { id }),
};

export const AdminOrderService = {
  list: () => adminApi.get("/api/order/list"),
  updateStatus: (orderId: string, status: string) =>
    adminApi.post("/api/order/status", { orderId, status }),
};

export const AiService = {
  recommend: (query: string) => api.post("/api/ai/recommend", { query }),
};

export default api;
