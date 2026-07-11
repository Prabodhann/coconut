import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { dispatch, selectToken } = vi.hoisted(() => ({
  dispatch: vi.fn(),
  selectToken: vi.fn(),
}));

vi.mock("@/store/hooks", () => ({
  useAppDispatch: () => dispatch,
  useAppSelector: (
    selector: (state: { auth: { token: string | null } }) => unknown,
  ) => selector({ auth: { token: selectToken() } }),
}));

vi.mock("@/store/slices/cartSlice", () => ({
  fetchCart: vi.fn(() => ({ type: "cart/fetchCart" })),
}));

vi.mock("@/store/slices/foodSlice", () => ({
  fetchFoodList: vi.fn(() => ({ type: "food/fetchFoodList" })),
}));

import { fetchCart } from "@/store/slices/cartSlice";
import { fetchFoodList } from "@/store/slices/foodSlice";
import { AppBootstrap } from "./AppBootstrap";

describe("AppBootstrap", () => {
  afterEach(() => {
    dispatch.mockReset();
    selectToken.mockReset();
    vi.mocked(fetchCart).mockClear();
    vi.mocked(fetchFoodList).mockClear();
  });

  it("fetches the food list on application load", () => {
    selectToken.mockReturnValue(null);

    render(<AppBootstrap />);

    expect(fetchFoodList).toHaveBeenCalledOnce();
    expect(fetchCart).not.toHaveBeenCalled();
  });

  it("fetches the cart when the user is authenticated", () => {
    selectToken.mockReturnValue("customer-token");

    render(<AppBootstrap />);

    expect(fetchCart).toHaveBeenCalledOnce();
  });
});
