import { render, screen } from "@testing-library/react";
import { SkeletonList } from "./SkeletonList";

describe("SkeletonList", () => {
  it("renders the title and the requested number of placeholder rows", () => {
    const { container } = render(<SkeletonList count={4} />);

    expect(screen.getByText("All Foods List")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-skeleton-item]").length).toBe(4);
  });
});
