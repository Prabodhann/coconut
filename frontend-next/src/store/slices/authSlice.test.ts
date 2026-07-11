import { describe, expect, it } from "vitest";
import authReducer, { logout, setAuth } from "./authSlice";

describe("authSlice", () => {
  it("stores a successful authentication session", () => {
    const state = authReducer(
      undefined,
      setAuth({ token: "customer-token", role: "user" }),
    );

    expect(state).toMatchObject({ token: "customer-token", role: "user" });
  });

  it("clears an authenticated session on logout", () => {
    const state = authReducer(
      { token: "customer-token", role: "user", loading: false, error: null },
      logout(),
    );

    expect(state).toMatchObject({ token: null, role: null });
  });
});
