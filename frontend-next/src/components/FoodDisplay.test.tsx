import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { setFoodList, setLoading } from "@/store/slices/foodSlice";
import { FoodDisplay } from "./FoodDisplay";

const food = [
  {
    _id: "1",
    name: "Kachumber Salad",
    description: "Fresh and tangy.",
    price: 69,
    category: "Salad",
    image: "https://example.com/salad.jpg",
  },
  {
    _id: "2",
    name: "Chicken Kathi Roll",
    description: "Grilled and wrapped.",
    price: 139,
    category: "Rolls",
    image: "https://example.com/roll.jpg",
  },
];

function renderDisplay(
  props: Partial<React.ComponentProps<typeof FoodDisplay>> = {},
) {
  return render(
    <Provider store={store}>
      <FoodDisplay category="All" {...props} />
    </Provider>,
  );
}

describe("FoodDisplay", () => {
  afterEach(() => {
    store.dispatch(setFoodList([]));
    store.dispatch(setLoading(false));
  });

  it("shows a loading spinner while the menu is loading", () => {
    store.dispatch(setLoading(true));

    const { container } = renderDisplay();

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows a skeleton loader when there is no food yet", () => {
    const { container } = renderDisplay();

    expect(
      container.querySelectorAll("[data-skeleton-item]").length,
    ).toBeGreaterThan(0);
  });

  it("renders each food item once loaded", () => {
    store.dispatch(setFoodList(food));

    renderDisplay();

    expect(screen.getByText("Kachumber Salad")).toBeInTheDocument();
    expect(screen.getByText("Chicken Kathi Roll")).toBeInTheDocument();
  });

  it("filters by category", () => {
    store.dispatch(setFoodList(food));

    renderDisplay({ category: "Rolls" });

    expect(screen.queryByText("Kachumber Salad")).not.toBeInTheDocument();
    expect(screen.getByText("Chicken Kathi Roll")).toBeInTheDocument();
  });

  it("filters by AI-recommended item ids", () => {
    store.dispatch(setFoodList(food));

    renderDisplay({ aiItemIds: ["2"] });

    expect(screen.queryByText("Kachumber Salad")).not.toBeInTheDocument();
    expect(screen.getByText("Chicken Kathi Roll")).toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", () => {
    store.dispatch(setFoodList(food));

    renderDisplay({ searchQuery: "pizza" });

    expect(screen.getByText(/no dishes found/i)).toBeInTheDocument();
  });
});
