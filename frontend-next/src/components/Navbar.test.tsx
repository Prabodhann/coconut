import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { store } from "@/store";
import { setAuth, logout } from "@/store/slices/authSlice";
import { Navbar } from "./Navbar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

function renderNavbar(setShowLogin = vi.fn()) {
  return render(
    <Provider store={store}>
      <Navbar setShowLogin={setShowLogin} />
    </Provider>,
  );
}

describe("Navbar", () => {
  afterEach(() => {
    store.dispatch(logout());
  });

  it("links to the home and cart routes", () => {
    renderNavbar();

    expect(screen.getByRole("link", { name: /coconut/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /cart/i })).toHaveAttribute(
      "href",
      "/cart",
    );
  });

  it("renders the theme toggle and mobile menu button", () => {
    renderNavbar();

    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("opens the login popup when signed out and Sign In is clicked", async () => {
    const setShowLogin = vi.fn();
    const user = userEvent.setup();
    renderNavbar(setShowLogin);

    await user.click(screen.getAllByText("Sign In")[0]);

    expect(setShowLogin).toHaveBeenCalledWith(true);
  });

  it("shows a profile menu instead of Sign In when authenticated", () => {
    store.dispatch(setAuth({ token: "abc", role: "user" }));

    renderNavbar();

    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });
});
