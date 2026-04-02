import axios from 'axios';
import { CONSTANTS } from '@/constants';

const api = axios.create({
  baseURL: CONSTANTS.API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const FoodService = {
  getFoodList: () => api.get('/api/food/list'),
};

export const CartService = {
  getCart: () => api.post('/api/cart/get', {}),
  addToCart: (itemId: string) => api.post('/api/cart/add', { itemId }),
  removeFromCart: (itemId: string) => api.post('/api/cart/remove', { itemId }),
};

export default api;
