import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/StorefrontPages", () => ({
  AppsPageContent: () => <h1>Mobile Apps</h1>,
  CheckoutPageContent: () => <h1>Order</h1>,
  OrdersPageContent: () => <h1>My Orders</h1>,
  ProfilePageContent: () => <h1>Profile</h1>,
  VerifyPageContent: () => <h1>Verify Order</h1>,
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
