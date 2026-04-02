export interface IFoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface ICartState {
  items: Record<string, number>;
  loading: boolean;
  error: string | null;
}

export interface IAuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface IAuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
