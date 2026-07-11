import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { AdminSidebar } from "./AdminSidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/list",
}));

describe("AdminSidebar", () => {
  it("renders a link for each admin nav item", () => {
    render(<AdminSidebar />);

    expect(screen.getByRole("link", { name: /add items/i })).toHaveAttribute(
      "href",
      "/admin/add",
    );
    expect(screen.getByRole("link", { name: /list items/i })).toHaveAttribute(
      "href",
      "/admin/list",
    );
    expect(screen.getByRole("link", { name: /orders/i })).toHaveAttribute(
      "href",
      "/admin/orders",
    );
  });

  it("marks the current route's link as active", () => {
    render(<AdminSidebar />);

    expect(screen.getByRole("link", { name: /list items/i })).toHaveClass(
      "text-orange-600",
    );
  });
});
