import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ListFoodPage } from "./ListFoodPage";
import { FoodService, AdminFoodService } from "@/services/api";

vi.mock("@/services/api", async () => {
  const actual =
    await vi.importActual<typeof import("@/services/api")>("@/services/api");
  return {
    ...actual,
    FoodService: { ...actual.FoodService, getFoodList: vi.fn() },
    AdminFoodService: {
      ...actual.AdminFoodService,
      remove: vi.fn(),
      update: vi.fn(),
    },
  };
});

const food = [
  {
    _id: "1",
    name: "Kachumber Salad",
    description: "Fresh salad.",
    price: 69,
    category: "Salad",
    image: "https://example.com/salad.jpg",
  },
  {
    _id: "2",
    name: "Chicken Kathi Roll",
    description: "Grilled roll.",
    price: 139,
    category: "Rolls",
    image: "https://example.com/roll.jpg",
  },
];

describe("ListFoodPage", () => {
  beforeEach(() => {
    vi.mocked(FoodService.getFoodList).mockResolvedValue({
      data: { success: true, data: food },
    });
  });

  it("shows a skeleton while loading, then the food grid", async () => {
    const { container } = render(<ListFoodPage />);

    expect(
      container.querySelectorAll("[data-skeleton-item]").length,
    ).toBeGreaterThan(0);

    expect(await screen.findByText("Kachumber Salad")).toBeInTheDocument();
    expect(screen.getByText("Chicken Kathi Roll")).toBeInTheDocument();
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    render(<ListFoodPage />);
    await screen.findByText("Kachumber Salad");

    await user.click(screen.getByRole("button", { name: "Rolls" }));

    expect(screen.queryByText("Kachumber Salad")).not.toBeInTheDocument();
    expect(screen.getByText("Chicken Kathi Roll")).toBeInTheDocument();
  });

  it("removes an item", async () => {
    const remove = vi.mocked(AdminFoodService.remove);
    remove.mockResolvedValueOnce({
      data: { success: true, message: "Removed" },
    });
    const user = userEvent.setup();
    render(<ListFoodPage />);
    await screen.findByText("Kachumber Salad");

    await user.click(screen.getAllByTitle("Remove Item")[0]);

    await waitFor(() => expect(remove).toHaveBeenCalledWith("1"));
  });

  it("edits an item with the correct payload shape", async () => {
    const update = vi.mocked(AdminFoodService.update);
    update.mockResolvedValueOnce({
      data: { success: true, message: "Updated" },
    });
    const user = userEvent.setup();
    render(<ListFoodPage />);
    await screen.findByText("Kachumber Salad");

    await user.click(screen.getAllByTitle("Edit Item")[0]);
    const nameInput = await screen.findByDisplayValue("Kachumber Salad");
    await user.clear(nameInput);
    await user.type(nameInput, "Kachumber Salad Deluxe");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        name: "Kachumber Salad Deluxe",
        description: "Fresh salad.",
        price: 69,
        category: "Salad",
      }),
    );
  });
});
