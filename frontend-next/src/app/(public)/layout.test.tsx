import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("@/components/Navbar", () => ({
  Navbar: ({ setShowLogin }: { setShowLogin: (show: boolean) => void }) => (
    <nav>
      <button onClick={() => setShowLogin(true)}>Open login</button>
    </nav>
  ),
}));
vi.mock("@/components/Footer", () => ({ Footer: () => <footer /> }));
vi.mock("@/components/LoginPopup", () => ({
  LoginPopup: ({ setShowLogin }: { setShowLogin: (show: boolean) => void }) => (
    <div role="dialog">
      <button onClick={() => setShowLogin(false)}>Close login</button>
    </div>
  ),
}));
import PublicLayout from "./layout";

describe("PublicLayout", () => {
  it("renders public route content", () => {
    render(
      <PublicLayout>
        <p>Public page</p>
      </PublicLayout>,
    );

    expect(screen.getByText("Public page")).toBeInTheDocument();
  });

  it("shows the login popup when the navbar requests it, and hides it again", async () => {
    const user = userEvent.setup();
    render(
      <PublicLayout>
        <p>Public page</p>
      </PublicLayout>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByText("Open login"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByText("Close login"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
