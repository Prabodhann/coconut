import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { store } from "@/store";
import { setAuth, logout } from "@/store/slices/authSlice";
import { setFoodList } from "@/store/slices/foodSlice";
import { incrementLocal, clearCart } from "@/store/slices/cartSlice";
import { CheckoutPage } from "./CheckoutPage";
import { OrderService } from "@/services/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/services/api")>(
    "@/services/api",
  );
  return { ...actual, OrderService: { ...actual.OrderService, place: vi.fn() } };
});

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

function renderCheckout() {
  return render(
    <Provider store={store}>
      <CheckoutPage />
    </Provider>,
  );
}

describe("CheckoutPage", () => {
  beforeEach(() => {
    store.dispatch(setFoodList(food));
    store.dispatch(setAuth({ token: "abc", role: "user" }));
    store.dispatch(incrementLocal("item-1"));
  });

  afterEach(() => {
    store.dispatch(logout());
    store.dispatch(clearCart());
    store.dispatch(setFoodList([]));
  });

  it("renders the delivery form and order summary", () => {
    renderCheckout();

    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Street address")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("₹69")).toBeInTheDocument();
  });

  it("submits a correctly-shaped order and redirects to the Stripe session", async () => {
    const place = vi.mocked(OrderService.place);
    place.mockResolvedValueOnce({
      data: { success: true, session_url: "https://stripe.example/session" },
    });
    const user = userEvent.setup();
    const assignMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, assign: assignMock },
      writable: true,
    });

    renderCheckout();
    await user.type(screen.getByPlaceholderText("First name"), "Ada");
    await user.type(screen.getByPlaceholderText("Last name"), "Lovelace");
    await user.type(
      screen.getByPlaceholderText("Email address"),
      "ada@example.com",
    );
    await user.type(screen.getByPlaceholderText("Street address"), "1 Main St");
    await user.selectOptions(screen.getByDisplayValue("Select State"), "Karnataka");
    await user.selectOptions(screen.getByDisplayValue("Select City"), "Bengaluru");
    await user.type(
      screen.getByPlaceholderText(/zip/i),
      "560001",
    );
    await user.type(screen.getByPlaceholderText(/phone/i), "9999999999");
    await user.click(screen.getByRole("button", { name: /proceed to payment/i }));

    expect(place).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 74,
        items: [
          { itemId: "item-1", name: "Kachumber Salad", price: 69, quantity: 1 },
        ],
        address: expect.objectContaining({
          firstName: "Ada",
          lastName: "Lovelace",
          email: "ada@example.com",
        }),
      }),
    );
    expect(assignMock).toHaveBeenCalledWith(
      "https://stripe.example/session",
    );
  });
});
