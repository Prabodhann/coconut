import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AdminOrdersPage } from "./AdminOrdersPage";
import { AdminOrderService } from "@/services/api";

vi.mock("@/services/api", async () => {
  const actual =
    await vi.importActual<typeof import("@/services/api")>("@/services/api");
  return {
    ...actual,
    AdminOrderService: {
      ...actual.AdminOrderService,
      list: vi.fn(),
      updateStatus: vi.fn(),
    },
  };
});

const orders = [
  {
    _id: "abc123def456",
    amount: 208,
    status: "Food Processing",
    date: new Date("2026-01-01").toISOString(),
    items: [{ name: "Kachumber Salad", quantity: 2 }],
    address: {
      firstName: "Ada",
      lastName: "Lovelace",
      street: "1 Main St",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      zipcode: "560001",
      phone: "9999999999",
    },
  },
  {
    _id: "def456ghi789",
    amount: 139,
    status: "Delivered",
    date: new Date("2026-01-02").toISOString(),
    items: [{ name: "Chicken Kathi Roll", quantity: 1 }],
    address: {
      firstName: "Grace",
      lastName: "Hopper",
      street: "2 Main St",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      zipcode: "560002",
      phone: "8888888888",
    },
  },
];

describe("AdminOrdersPage", () => {
  beforeEach(() => {
    vi.mocked(AdminOrderService.list).mockResolvedValue({
      data: { success: true, data: [...orders] },
    });
  });

  it("shows a skeleton while loading, then renders the orders", async () => {
    const { container } = render(<AdminOrdersPage />);

    expect(
      container.querySelectorAll("[data-skeleton-item]").length,
    ).toBeGreaterThan(0);

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
  });

  it("filters by status", async () => {
    const user = userEvent.setup();
    render(<AdminOrdersPage />);
    await screen.findByText("Ada Lovelace");

    await user.click(screen.getByRole("button", { name: "Delivered" }));

    await waitFor(() =>
      expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
  });

  it("updates an order's status", async () => {
    const updateStatus = vi.mocked(AdminOrderService.updateStatus);
    updateStatus.mockResolvedValueOnce({
      data: { success: true, message: "Updated" },
    });
    const user = userEvent.setup();
    render(<AdminOrdersPage />);
    await screen.findByText("Ada Lovelace");

    const [statusSelect] = screen.getAllByDisplayValue("Food Processing");
    await user.selectOptions(statusSelect, "Out for delivery");

    await waitFor(() =>
      expect(updateStatus).toHaveBeenCalledWith(
        "abc123def456",
        "Out for delivery",
      ),
    );
  });
});
