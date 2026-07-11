import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AdminLayout from "./layout";

describe("AdminLayout", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("blocks a visitor without an administrator session", async () => {
    render(
      <AdminLayout>
        <p>Admin content</p>
      </AdminLayout>,
    );

    expect(await screen.findByText("Admin login required")).toBeInTheDocument();
  });

  it("renders child routes for an administrator session", async () => {
    window.localStorage.setItem("admin_token", "admin-token");
    window.localStorage.setItem("admin_role", "admin");

    render(
      <AdminLayout>
        <p>Admin content</p>
      </AdminLayout>,
    );

    await waitFor(() =>
      expect(screen.getByText("Admin content")).toBeInTheDocument(),
    );
  });
});
