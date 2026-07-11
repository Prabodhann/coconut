import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import authReducer from "@/store/slices/authSlice";
import cartReducer from "@/store/slices/cartSlice";
import foodReducer from "@/store/slices/foodSlice";
import { FoodList } from "./FoodList";

describe("FoodList", () => {
  it("renders available food and adds an item to the cart", () => {
    const store = configureStore({
      reducer: { auth: authReducer, cart: cartReducer, food: foodReducer },
      preloadedState: {
        auth: { token: null, role: null, loading: false, error: null },
        cart: { items: {}, loading: false, error: null },
        food: {
          list: [
            {
              _id: "food-1",
              name: "Coconut Curry",
              description: "Creamy curry",
              price: 12,
              image: "",
              category: "Curry",
            },
          ],
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <FoodList />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add Coconut Curry" }));

    expect(screen.getByText("Coconut Curry")).toBeInTheDocument();
    expect(store.getState().cart.items).toEqual({ "food-1": 1 });
  });
});
