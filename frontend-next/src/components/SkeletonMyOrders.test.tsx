import { render, screen } from "@testing-library/react";
import { SkeletonMyOrders } from "./SkeletonMyOrders";

describe("SkeletonMyOrders", () => {
  it("renders the title and the requested number of placeholder rows", () => {
    const { container } = render(<SkeletonMyOrders count={3} />);

    expect(screen.getByText("My Orders")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-skeleton-row]").length).toBe(3);
  });
});
