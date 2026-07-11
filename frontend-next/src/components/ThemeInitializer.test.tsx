import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeInitializer } from "./ThemeInitializer";

describe("ThemeInitializer", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.clear();
  });

  it("applies the persisted dark theme", () => {
    window.localStorage.setItem("theme", "dark");

    render(<ThemeInitializer />);

    expect(document.documentElement).toHaveClass("dark");
  });
});
