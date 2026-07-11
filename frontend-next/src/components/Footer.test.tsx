import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the brand, social icons, and quick links", () => {
    render(<Footer />);

    expect(screen.getByText("Coconut")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Twitter" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "LinkedIn" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders the newsletter box and bottom bar", () => {
    render(<Footer />);

    expect(screen.getByPlaceholderText("Enter email...")).toBeInTheDocument();
    expect(screen.getByText(/coconut.com/i)).toBeInTheDocument();
  });
});
