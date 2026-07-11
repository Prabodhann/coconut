import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AddFoodPage } from "./AddFoodPage";
import { AdminFoodService } from "@/services/api";

vi.mock("@/services/api", async () => {
  const actual =
    await vi.importActual<typeof import("@/services/api")>("@/services/api");
  return {
    ...actual,
    AdminFoodService: { ...actual.AdminFoodService, add: vi.fn() },
  };
});

describe("AddFoodPage", () => {
  it("renders the upload dropzone and product fields", () => {
    render(<AddFoodPage />);

    expect(screen.getByText("Click to upload")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/classic greek salad/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add product/i }),
    ).toBeInTheDocument();
  });

  it("submits the food item as JSON with a base64 imageData field", async () => {
    const add = vi.mocked(AdminFoodService.add);
    add.mockResolvedValueOnce({ data: { success: true, message: "Added" } });
    const user = userEvent.setup();

    render(<AddFoodPage />);
    await user.type(
      screen.getByPlaceholderText(/classic greek salad/i),
      "Kachumber Salad",
    );
    await user.type(
      screen.getByPlaceholderText(/describe the meal/i),
      "Fresh and tangy.",
    );
    await user.type(screen.getByPlaceholderText("299"), "69");

    const file = new File(["fake-image"], "salad.png", { type: "image/png" });
    const fileInput = document.getElementById("image") as HTMLInputElement;
    await user.upload(fileInput, file);

    await user.click(screen.getByRole("button", { name: /add product/i }));

    await waitFor(() =>
      expect(add).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Kachumber Salad",
          description: "Fresh and tangy.",
          price: 69,
          category: "Salad",
          imageData: expect.stringMatching(/^data:image\/png;base64,/),
        }),
      ),
    );
  });
});
