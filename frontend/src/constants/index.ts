export const CONSTANTS = {
  // Replaced with actual env variable mapping via Vite
  API_URL: import.meta.env.VITE_API_URL || '',
  LOCAL_STORAGE_TOKEN_KEY: 'token',
  LOCAL_STORAGE_ROLE_KEY: 'role',
};

export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  ORDER: '/order',
  MY_ORDERS: '/myorders',
  VERIFY: '/verify',
};
