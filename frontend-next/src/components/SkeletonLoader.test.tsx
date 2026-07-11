import { render } from "@testing-library/react";
import { SkeletonLoader } from "./SkeletonLoader";

describe("SkeletonLoader", () => {
  it("renders the requested number of placeholder cards", () => {
    const { container } = render(<SkeletonLoader count={6} />);

    expect(container.querySelectorAll("[data-skeleton-item]").length).toBe(6);
  });

  it("defaults to 24 placeholder cards", () => {
    const { container } = render(<SkeletonLoader />);

    expect(container.querySelectorAll("[data-skeleton-item]").length).toBe(
      24,
    );
  });
});
