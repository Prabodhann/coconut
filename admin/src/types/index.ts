export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface OrderItem {
  _id: string;
  items: FoodItem[];
  amount: number;
  address: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
  };
  status: string;
  date: string;
  payment: boolean;
}
