import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AppDownloadPromo } from "./AppDownloadPromo";
import { NewsletterService } from "@/services/api";

vi.mock("@/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/services/api")>(
    "@/services/api",
  );
  return {
    ...actual,
    NewsletterService: { ...actual.NewsletterService, subscribe: vi.fn() },
  };
});

describe("AppDownloadPromo", () => {
  it("renders store badges linking to the app-download page", () => {
    render(<AppDownloadPromo />);

    expect(screen.getByRole("link", { name: /play store/i })).toHaveAttribute(
      "href",
      "/app-download",
    );
    expect(screen.getByRole("link", { name: /app store/i })).toHaveAttribute(
      "href",
      "/app-download",
    );
  });

  it("subscribes an email and shows a success state", async () => {
    const subscribe = vi.mocked(NewsletterService.subscribe);
    subscribe.mockResolvedValueOnce({ data: { success: true } });
    const user = userEvent.setup();

    render(<AppDownloadPromo />);
    await user.type(
      screen.getByPlaceholderText(/email for early access/i),
      "ada@example.com",
    );
    await user.click(screen.getByRole("button", { name: /notify me/i }));

    expect(subscribe).toHaveBeenCalledWith("ada@example.com");
    expect(await screen.findByText(/on the list/i)).toBeInTheDocument();
  });
});
