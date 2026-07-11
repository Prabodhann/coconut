import { vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import AdminIndexPage from "./page";

describe("AdminIndexPage", () => {
  it("redirects to /admin/add", () => {
    AdminIndexPage();

    expect(redirectMock).toHaveBeenCalledWith("/admin/add");
  });
});
