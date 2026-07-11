import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("identifies the Coconut application", () => {
    render(<Footer />);

    expect(screen.getByText("Coconut")).toBeInTheDocument();
  });
});
