import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/Navbar", () => ({ Navbar: () => <nav /> }));
vi.mock("@/components/Footer", () => ({ Footer: () => <footer /> }));
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
});
