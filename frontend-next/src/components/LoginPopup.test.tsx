import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { store } from "@/store";
import { LoginPopup } from "./LoginPopup";
import { UserService } from "@/services/api";

vi.mock("@/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/services/api")>(
    "@/services/api",
  );
  return {
    ...actual,
    UserService: { ...actual.UserService, login: vi.fn(), register: vi.fn() },
  };
});

function renderWithStore(ui: React.ReactElement) {
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("LoginPopup", () => {
  it("renders the sign-up form by default", () => {
    renderWithStore(<LoginPopup setShowLogin={vi.fn()} />);

    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("switches to the login form", async () => {
    const user = userEvent.setup();
    renderWithStore(<LoginPopup setShowLogin={vi.fn()} />);

    await user.click(screen.getByText("Login here"));

    await waitForElementToBeRemoved(() =>
      screen.queryByPlaceholderText("Your name"),
    );
  });

  it("logs in and closes the popup on success", async () => {
    const login = vi.mocked(UserService.login);
    login.mockResolvedValueOnce({
      data: { success: true, token: "abc", role: "user" },
    });
    const setShowLogin = vi.fn();
    const user = userEvent.setup();
    renderWithStore(<LoginPopup setShowLogin={setShowLogin} />);

    await user.click(screen.getByText("Login here"));
    await waitForElementToBeRemoved(() =>
      screen.queryByPlaceholderText("Your name"),
    );
    await user.type(screen.getByPlaceholderText("Your email"), "a@b.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(login).toHaveBeenCalledWith("a@b.com", "secret123");
    expect(setShowLogin).toHaveBeenCalledWith(false);
  });
});
