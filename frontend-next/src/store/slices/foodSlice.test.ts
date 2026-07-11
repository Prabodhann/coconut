import { describe, expect, it } from "vitest";
import foodReducer, { fetchFoodList } from "./foodSlice";

describe("foodSlice", () => {
  it("sets loading while the food list is requested", () => {
    const state = foodReducer(undefined, fetchFoodList.pending("request-1"));

    expect(state.loading).toBe(true);
  });

  it("stores a successfully fetched food list", () => {
    const food = {
      _id: "food-1",
      name: "Coconut Curry",
      description: "Creamy curry",
      price: 12,
      image: "curry.jpg",
      category: "Curry",
    };
    const state = foodReducer(
      undefined,
      fetchFoodList.fulfilled([food], "request-1"),
    );

    expect(state).toMatchObject({ loading: false, list: [food] });
  });
});
