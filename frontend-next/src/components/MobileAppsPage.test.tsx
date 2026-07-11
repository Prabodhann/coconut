import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MobileAppsPage } from "./MobileAppsPage";
import { NewsletterService } from "@/services/api";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/services/api", async () => {
  const actual =
    await vi.importActual<typeof import("@/services/api")>("@/services/api");
  return {
    ...actual,
    NewsletterService: { ...actual.NewsletterService, subscribe: vi.fn() },
  };
});

describe("MobileAppsPage", () => {
  it("renders the coming-soon heading and platform badges", () => {
    render(<MobileAppsPage />);

    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(screen.getByText("Android")).toBeInTheDocument();
    expect(screen.getByText("iOS")).toBeInTheDocument();
  });

  it("navigates home when Back to Home is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileAppsPage />);

    await user.click(screen.getByRole("button", { name: /back to home/i }));

    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("subscribes an email and shows the success message", async () => {
    const subscribe = vi.mocked(NewsletterService.subscribe);
    subscribe.mockResolvedValueOnce({ data: { success: true } });
    const user = userEvent.setup();

    render(<MobileAppsPage />);
    await user.type(
      screen.getByPlaceholderText(/email for early access/i),
      "ada@example.com",
    );
    await user.click(screen.getByRole("button", { name: /notify me/i }));

    expect(subscribe).toHaveBeenCalledWith("ada@example.com");
    expect(await screen.findByText(/on the list/i)).toBeInTheDocument();
  });
});
