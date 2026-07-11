import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { FoodItem } from "./FoodItem";

function renderItem() {
  return render(
    <Provider store={store}>
      <FoodItem
        id="item-1"
        name="Kachumber Salad"
        price={69}
        desc="A simple and classic Indian salad."
        image="https://example.com/salad.jpg"
      />
    </Provider>,
  );
}

describe("FoodItem", () => {
  afterEach(() => {
    store.dispatch(logout());
    store.dispatch(clearCart());
  });

  it("renders the name, description, and price", () => {
    renderItem();

    expect(screen.getByText("Kachumber Salad")).toBeInTheDocument();
    expect(
      screen.getByText("A simple and classic Indian salad."),
    ).toBeInTheDocument();
    expect(screen.getByText("₹69")).toBeInTheDocument();
  });

  it("shows an add button when the item isn't in the cart", () => {
    renderItem();

    expect(screen.getByLabelText(/add/i)).toBeInTheDocument();
  });

  it("shows a quantity stepper once the item is added", async () => {
    const user = userEvent.setup();
    renderItem();

    await user.click(screen.getByLabelText(/add/i));

    expect(await screen.findByText("1")).toBeInTheDocument();
  });
});
