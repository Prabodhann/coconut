import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/StorefrontPages", () => ({
  CartPageContent: () => (
    <>
      <h1>Cart</h1>
      <p>Cart Items</p>
    </>
  ),
}));

import CartPage from "./page";

describe("CartPage", () => {
  it("renders the cart heading", () => {
    render(<CartPage />);

    expect(screen.getByRole("heading", { name: /cart/i })).toBeInTheDocument();
    expect(screen.getByText("Cart Items")).toBeInTheDocument();
  });
});
