import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AdminNavbar } from "./AdminNavbar";

describe("AdminNavbar", () => {
  it("shows the Admin Panel badge", () => {
    render(<AdminNavbar theme="light" toggleTheme={vi.fn()} />);

    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
  });

  it("calls toggleTheme when the theme button is clicked", async () => {
    const toggleTheme = vi.fn();
    const user = userEvent.setup();
    render(<AdminNavbar theme="light" toggleTheme={toggleTheme} />);

    await user.click(screen.getByLabelText(/toggle dark mode/i));

    expect(toggleTheme).toHaveBeenCalled();
  });

  it("shows a logout button only when onLogout is provided", async () => {
    const onLogout = vi.fn();
    const user = userEvent.setup();
    render(
      <AdminNavbar theme="light" toggleTheme={vi.fn()} onLogout={onLogout} />,
    );

    await user.click(screen.getByTitle("Logout"));
    expect(onLogout).toHaveBeenCalled();
  });

  it("hides the logout button when onLogout is absent", () => {
    render(<AdminNavbar theme="light" toggleTheme={vi.fn()} />);

    expect(screen.queryByTitle("Logout")).not.toBeInTheDocument();
  });
});
