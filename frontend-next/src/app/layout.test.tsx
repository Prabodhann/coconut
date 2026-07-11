import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans" }),
  Geist_Mono: () => ({ variable: "geist-mono" }),
}));

vi.mock("@/store/provider", () => ({
  ReduxProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="redux-provider">{children}</div>
  ),
}));

vi.mock("@/components/AppBootstrap", () => ({
  AppBootstrap: () => null,
}));

vi.mock("@/components/BackendWarmup", () => ({
  BackendWarmup: () => null,
}));

vi.mock("@/components/ThemeInitializer", () => ({
  ThemeInitializer: () => null,
}));

import RootLayout from "./layout";

describe("RootLayout", () => {
  it("wraps application content in the Redux provider", () => {
    render(
      <RootLayout>
        <p>Page content</p>
      </RootLayout>,
    );

    expect(screen.getByTestId("redux-provider")).toHaveTextContent(
      "Page content",
    );
  });
});
