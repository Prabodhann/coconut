import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { VercelV0Chat } from "./VercelV0Chat";
import { AiService } from "@/services/api";

vi.mock("@/services/api", () => ({
  AiService: { recommend: vi.fn() },
}));

describe("VercelV0Chat", () => {
  it("renders the assistant title and input", () => {
    render(<VercelV0Chat />);

    expect(
      screen.getByRole("heading", { name: /what can i help you order/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/craving a spicy coconut curry bowl/i),
    ).toBeInTheDocument();
  });

  it("submits a query, shows the AI response, and reports item ids", async () => {
    const recommend = vi.mocked(AiService.recommend);
    recommend.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Try the coconut curry!",
        itemIds: ["1", "2"],
      },
    });
    const onAiResult = vi.fn();
    const user = userEvent.setup();

    render(<VercelV0Chat onAiResult={onAiResult} />);
    await user.type(
      screen.getByPlaceholderText(/craving a spicy coconut curry bowl/i),
      "something spicy{Enter}",
    );

    expect(
      await screen.findByText("Try the coconut curry!"),
    ).toBeInTheDocument();
    expect(onAiResult).toHaveBeenCalledWith(["1", "2"]);
    expect(recommend).toHaveBeenCalledWith("something spicy");
  });

  it("shows an error message when the request fails", async () => {
    const recommend = vi.mocked(AiService.recommend);
    recommend.mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();

    render(<VercelV0Chat />);
    await user.type(
      screen.getByPlaceholderText(/craving a spicy coconut curry bowl/i),
      "tacos{Enter}",
    );

    await waitFor(() =>
      expect(
        screen.getByText(/culinary ai circuits are a bit overloaded/i),
      ).toBeInTheDocument(),
    );
  });
});
