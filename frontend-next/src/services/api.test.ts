import { afterEach, describe, expect, it, vi } from "vitest";
import api, { getApiBaseUrl, getStoredToken, NewsletterService } from "./api";

describe("API configuration", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllEnvs();
  });

  it("uses the public Next.js API URL", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.coconut.test");

    expect(getApiBaseUrl()).toBe("https://api.coconut.test");
  });

  it("returns the persisted storefront token in the browser", () => {
    window.localStorage.setItem("token", "customer-token");

    expect(getStoredToken()).toBe("customer-token");
  });

  it("adds the persisted token to API requests", () => {
    window.localStorage.setItem("token", "customer-token");
    const requestInterceptor = (
      api.interceptors.request as unknown as {
        handlers: Array<{
          fulfilled: (config: { headers: Record<string, string> }) => unknown;
        }>;
      }
    ).handlers[0].fulfilled;

    expect(requestInterceptor({ headers: {} })).toMatchObject({
      headers: { Authorization: "Bearer customer-token" },
    });
  });

  it("posts to the newsletter subscribe endpoint with just the email", () => {
    const spy = vi.spyOn(api, "post").mockResolvedValueOnce({ data: { success: true } });

    NewsletterService.subscribe("ada@example.com");

    expect(spy).toHaveBeenCalledWith("/api/newsletter/subscribe", {
      email: "ada@example.com",
    });
  });
});
