"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCartItem } from "@/store/slices/cartSlice";

export function FoodList() {
  const dispatch = useAppDispatch();
  const food = useAppSelector((state) => state.food.list);

  return (
    <section aria-labelledby="food-list-title">
      <h2 id="food-list-title">Exclusive Delights</h2>
      <ul>
        {food.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
            <button
              type="button"
              onClick={() => dispatch(addCartItem(item._id))}
            >
              Add {item.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
