import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("links to the home and cart routes", () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Cart" })).toHaveAttribute(
      "href",
      "/cart",
    );
  });
});
