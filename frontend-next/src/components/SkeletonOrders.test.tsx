import { render } from "@testing-library/react";
import { SkeletonOrders } from "./SkeletonOrders";

describe("SkeletonOrders", () => {
  it("renders the requested number of placeholder rows", () => {
    const { container } = render(<SkeletonOrders count={4} />);

    expect(container.querySelectorAll("[data-skeleton-item]").length).toBe(4);
  });
});
