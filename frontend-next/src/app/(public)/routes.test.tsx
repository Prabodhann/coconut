import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/StorefrontPages", () => ({
  VerifyPageContent: () => <h1>Verify Order</h1>,
}));
vi.mock("@/components/CheckoutPage", () => ({
  CheckoutPage: () => <h1>Order</h1>,
}));
vi.mock("@/components/MyOrdersPage", () => ({
  MyOrdersPage: () => <h1>My Orders</h1>,
}));
vi.mock("@/components/ProfilePage", () => ({
  ProfilePage: () => <h1>Profile</h1>,
}));
vi.mock("@/components/MobileAppsPage", () => ({
  MobileAppsPage: () => <h1>Mobile Apps</h1>,
}));
import MobileAppsPage from "./app-download/page";
import MyOrdersPage from "./myorders/page";
import OrderPage from "./order/page";
import ProfilePage from "./profile/page";
import VerifyPage from "./verify/page";

describe("public routes", () => {
  it.each([
    ["Order", OrderPage],
    ["My Orders", MyOrdersPage],
    ["Verify Order", VerifyPage],
    ["Profile", ProfilePage],
    ["Mobile Apps", MobileAppsPage],
  ])("renders the %s page", (heading, Page) => {
    render(<Page />);

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });
});
