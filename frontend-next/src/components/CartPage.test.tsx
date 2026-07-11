import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { store } from "@/store";
import { setFoodList } from "@/store/slices/foodSlice";
import { incrementLocal, clearCart } from "@/store/slices/cartSlice";
import { CartPage } from "./CartPage";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const food = [
  {
    _id: "item-1",
    name: "Kachumber Salad",
    description: "Fresh salad.",
    price: 69,
    category: "Salad",
    image: "https://example.com/salad.jpg",
  },
];

function renderCart() {
  return render(
    <Provider store={store}>
      <CartPage />
    </Provider>,
  );
}

describe("CartPage", () => {
  afterEach(() => {
    store.dispatch(clearCart());
    store.dispatch(setFoodList([]));
    pushMock.mockClear();
  });

  it("shows an empty state and navigates home from it", async () => {
    const user = userEvent.setup();
    renderCart();

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /explore menu/i }));
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("lists cart items with quantity controls and totals", async () => {
    store.dispatch(setFoodList(food));
    store.dispatch(incrementLocal("item-1"));
    const user = userEvent.setup();

    renderCart();

    expect(screen.getAllByText("Kachumber Salad").length).toBeGreaterThan(0);
    expect(screen.getAllByText("₹69").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /checkout/i }));
    expect(pushMock).toHaveBeenCalledWith("/order");
  });
});
