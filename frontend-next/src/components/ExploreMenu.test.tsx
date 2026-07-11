import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ExploreMenu } from "./ExploreMenu";

describe("ExploreMenu", () => {
  it("renders the All filter and each menu category", () => {
    render(<ExploreMenu category="All" setCategory={vi.fn()} />);

    expect(screen.getAllByText("All").length).toBeGreaterThan(0);
    expect(screen.getByText("Salad")).toBeInTheDocument();
    expect(screen.getByText("Rolls")).toBeInTheDocument();
  });

  it("selects a category on click", async () => {
    const setCategory = vi.fn();
    const user = userEvent.setup();
    render(<ExploreMenu category="All" setCategory={setCategory} />);

    await user.click(screen.getByText("Salad"));

    expect(setCategory).toHaveBeenCalled();
  });
});
