import { afterEach, describe, expect, it, vi } from "vitest";
import { warmUpServer } from "./BackendWarmup";

describe("warmUpServer", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("pings the configured backend health endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.coconut.test");
    const fetchMock = vi.fn().mockResolvedValue(new Response());
    vi.stubGlobal("fetch", fetchMock);

    await warmUpServer();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.coconut.test/health",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
