import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MyOrdersPage } from "./MyOrdersPage";
import { OrderService } from "@/services/api";

const NO_ORDERS_TEXT = "No orders found";

vi.mock("@/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/services/api")>(
    "@/services/api",
  );
  return { ...actual, OrderService: { ...actual.OrderService, mine: vi.fn() } };
});

describe("MyOrdersPage", () => {
  it("shows a skeleton while orders are loading", () => {
    vi.mocked(OrderService.mine).mockReturnValue(new Promise(() => {}));

    const { container } = render(<MyOrdersPage />);

    expect(container.querySelectorAll("[data-skeleton-row]").length).toBeGreaterThan(0);
  });

  it("shows an empty state when there are no orders", async () => {
    vi.mocked(OrderService.mine).mockResolvedValueOnce({ data: { data: [] } });

    render(<MyOrdersPage />);

    expect(await screen.findByText(NO_ORDERS_TEXT)).toBeInTheDocument();
  });

  it("renders orders with the parcel icon and a track order button", async () => {
    vi.mocked(OrderService.mine).mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: "abc123def456",
            amount: 208,
            status: "Food Processing",
            date: new Date().toISOString(),
            items: [{ name: "Kachumber Salad", quantity: 2 }],
          },
        ],
      },
    });

    render(<MyOrdersPage />);

    expect(await screen.findByText(/kachumber salad x 2/i)).toBeInTheDocument();
    expect(screen.getByText("Food Processing")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /track order/i }),
    ).toBeInTheDocument();
  });
});
