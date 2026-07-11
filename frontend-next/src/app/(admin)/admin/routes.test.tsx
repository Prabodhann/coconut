import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/AddFoodPage", () => ({
  AddFoodPage: () => <h1>Add Items</h1>,
}));
vi.mock("@/components/ListFoodPage", () => ({
  ListFoodPage: () => <h1>List Items</h1>,
}));
vi.mock("@/components/AdminOrdersPage", () => ({
  AdminOrdersPage: () => <h1>Orders</h1>,
}));
import AddPage from "./add/page";
import ListPage from "./list/page";
import OrdersPage from "./orders/page";

describe("admin routes", () => {
  it.each([
    ["Add Items", AddPage],
    ["List Items", ListPage],
    ["Orders", OrdersPage],
  ])("renders the %s page", (heading, Page) => {
    render(<Page />);

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });
});
