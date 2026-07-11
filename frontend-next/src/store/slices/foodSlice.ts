import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { FoodService } from "@/services/api";
import type { IFoodItem } from "@/types";

interface IFoodState {
  list: IFoodItem[];
  loading: boolean;
  error: string | null;
}

const initialState: IFoodState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchFoodList = createAsyncThunk("food/fetchList", async () => {
  const response = await FoodService.getFoodList();
  return response.data.data;
});

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    setFoodList: (state, action: PayloadAction<IFoodItem[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFoodList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFoodList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load food list";
      });
  },
});

export const { setFoodList, setLoading } = foodSlice.actions;
export default foodSlice.reducer;
