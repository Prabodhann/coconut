import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/CartPage", () => ({
  CartPage: () => (
    <>
      <h1>Cart</h1>
      <p>Cart Items</p>
    </>
  ),
}));

import CartRoutePage from "./page";

describe("CartPage route", () => {
  it("renders the cart heading", () => {
    render(<CartRoutePage />);

    expect(screen.getByRole("heading", { name: /cart/i })).toBeInTheDocument();
    expect(screen.getByText("Cart Items")).toBeInTheDocument();
  });
});
