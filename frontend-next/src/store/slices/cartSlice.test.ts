import { describe, expect, it } from "vitest";
import cartReducer, {
  clearCart,
  decrementLocal,
  incrementLocal,
} from "./cartSlice";

describe("cartSlice", () => {
  it("increments and decrements an item quantity", () => {
    const added = cartReducer(undefined, incrementLocal("food-1"));
    const removed = cartReducer(added, decrementLocal("food-1"));

    expect(removed.items).toEqual({ "food-1": 0 });
  });

  it("clears all cart items", () => {
    const state = cartReducer(
      { items: { "food-1": 2 }, loading: false, error: null },
      clearCart(),
    );

    expect(state.items).toEqual({});
  });
});
