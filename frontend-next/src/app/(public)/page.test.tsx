import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/StorefrontPages", () => ({
  HomePage: () => (
    <>
      <h1>Coconut</h1>
      <section>Exclusive Delights</section>
    </>
  ),
}));

import Home from "./page";

describe("Home", () => {
  it("renders the Coconut heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /coconut/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Exclusive Delights")).toBeInTheDocument();
  });
});
