import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAppSelector } from "./hooks";
import { ReduxProvider } from "./provider";

function AuthStatus() {
  const token = useAppSelector((state) => state.auth.token);

  return <span>{token ?? "Signed out"}</span>;
}

describe("ReduxProvider", () => {
  it("makes the application store available to client components", () => {
    render(
      <ReduxProvider>
        <AuthStatus />
      </ReduxProvider>,
    );

    expect(screen.getByText("Signed out")).toBeInTheDocument();
  });
});
