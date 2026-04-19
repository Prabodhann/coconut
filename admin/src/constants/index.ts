export const ADMIN_NAV_LINKS = [
  { name: 'Add Items', path: '/add', icon: 'PlusCircle' },
  { name: 'List Items', path: '/list', icon: 'ListIcon' },
  { name: 'Orders', path: '/orders', icon: 'ShoppingBag' },
];

export const FOOD_CATEGORIES = [
  'Salad',
  'Rolls',
  'Deserts',
  'Sandwich',
  'Cake',
  'Pure Veg',
  'Pasta',
  'Noodles',
  'Chinese'
];

export const ORDER_STATUSES = [
  "Food Processing",
  "Out for delivery",
  "Delivered"
];

export const STATUS_COLOR_MAP: Record<string, string> = {
  "Food Processing": "text-orange-600 bg-orange-100 border-orange-200",
  "Out for delivery": "text-blue-600 bg-blue-100 border-blue-200",
  "Delivered": "text-emerald-700 bg-emerald-100 border-emerald-200",
  "default": "text-gray-600 bg-gray-100 border-gray-200"
};
