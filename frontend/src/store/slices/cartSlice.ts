import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ICartState } from '@/types';
import { CartService } from '@/services/api';
import { RootState } from '../index';

const initialState: ICartState = {
  items: {},
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (state.auth.token) {
      const response = await CartService.getCart();
      return response.data.cartData || {};
    }
    return {};
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async (itemId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    dispatch(cartSlice.actions.incrementLocal(itemId));
    if (state.auth.token) {
      await CartService.addToCart(itemId);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    dispatch(cartSlice.actions.decrementLocal(itemId));
    if (state.auth.token) {
      await CartService.removeFromCart(itemId);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    incrementLocal: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.items[id]) {
        state.items[id] = 1;
      } else {
        state.items[id] += 1;
      }
    },
    decrementLocal: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.items[id] > 0) {
        state.items[id] -= 1;
      }
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { incrementLocal, decrementLocal, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
