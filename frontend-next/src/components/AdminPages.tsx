"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AdminFoodService,
  AdminOrderService,
  FoodService,
} from "@/services/api";

type Food = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export function AddFoodPage() {
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await AdminFoodService.add(new FormData(event.currentTarget));
      event.currentTarget.reset();
      toast.success("Menu item added");
    } catch {
      toast.error("Could not add this item");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h1 className="text-3xl font-black">Add item</h1>
      <p className="mt-1 text-zinc-500">Add a dish to today&apos;s menu.</p>
      <form
        onSubmit={submit}
        className="mt-7 grid max-w-2xl gap-4 rounded-3xl border p-6 dark:border-zinc-800 sm:grid-cols-2"
      >
        {[
          ["name", "Dish name", "text"],
          ["price", "Price", "number"],
          ["category", "Category", "text"],
          ["image", "Dish image", "file"],
          ["description", "Description", "text"],
        ].map(([name, label, type]) => (
          <label
            key={name}
            className={
              name === "description" || name === "image" ? "sm:col-span-2" : ""
            }
          >
            <span className="mb-1 block text-sm font-medium">{label}</span>
            {name === "description" ? (
              <textarea
                required
                name={name}
                className="min-h-28 w-full rounded-xl border bg-transparent p-3"
              />
            ) : (
              <input
                required
                name={name}
                type={type}
                min={name === "price" ? "0" : undefined}
                className="w-full rounded-xl border bg-transparent p-3"
              />
            )}
          </label>
        ))}
        <button
          disabled={busy}
          className="sm:col-span-2 rounded-xl bg-orange-500 py-3 font-semibold text-white"
        >
          {busy ? "Saving…" : "Add to menu"}
        </button>
      </form>
    </section>
  );
}

export function ListFoodPage() {
  const [food, setFood] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    FoodService.getFoodList()
      .then((r) => setFood(r.data.data || []))
      .catch(() => toast.error("Could not load the menu"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    FoodService.getFoodList()
      .then((r) => setFood(r.data.data || []))
      .catch(() => toast.error("Could not load the menu"))
      .finally(() => setLoading(false));
  }, []);
  async function remove(id: string) {
    if (!window.confirm("Remove this item from the menu?")) return;
    try {
      await AdminFoodService.remove(id);
      setFood((items) => items.filter((item) => item._id !== id));
      toast.success("Item removed");
    } catch {
      toast.error("Could not remove item");
    }
  }
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Menu items</h1>
          <p className="mt-1 text-zinc-500">Edit your live catalogue.</p>
        </div>
        <button onClick={load} className="rounded-xl border px-4 py-2">
          Refresh
        </button>
      </div>
      {loading ? (
        <p className="mt-8 text-zinc-500">Loading menu…</p>
      ) : (
        <div className="mt-7 overflow-hidden rounded-2xl border dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {food.map((item) => (
                <tr key={item._id} className="border-t dark:border-zinc-800">
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">₹{item.price}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => remove(item._id)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!food.length && (
            <p className="p-6 text-center text-zinc-500">No menu items yet.</p>
          )}
        </div>
      )}
    </section>
  );
}

type Order = {
  _id: string;
  amount: number;
  status: string;
  date: string;
  address: { firstName: string; lastName: string };
  items: Array<{ name: string; quantity: number }>;
};
export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    AdminOrderService.list()
      .then((r) => setOrders(r.data.data || r.data.orders || []))
      .catch(() => toast.error("Could not load orders"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    AdminOrderService.list()
      .then((r) => setOrders(r.data.data || r.data.orders || []))
      .catch(() => toast.error("Could not load orders"))
      .finally(() => setLoading(false));
  }, []);
  async function update(id: string, status: string) {
    try {
      await AdminOrderService.updateStatus(id, status);
      setOrders((rows) =>
        rows.map((row) => (row._id === id ? { ...row, status } : row)),
      );
    } catch {
      toast.error("Could not update this order");
    }
  }
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Orders</h1>
          <p className="mt-1 text-zinc-500">Track and update deliveries.</p>
        </div>
        <button onClick={load} className="rounded-xl border px-4 py-2">
          Refresh
        </button>
      </div>
      {loading ? (
        <p className="mt-8 text-zinc-500">Loading orders…</p>
      ) : (
        <div className="mt-7 space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-2xl border p-5 dark:border-zinc-800"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-bold">
                    {order.address.firstName} {order.address.lastName}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    #{order._id.slice(-6).toUpperCase()} · ₹{order.amount}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => update(order._id, e.target.value)}
                  className="rounded-lg border bg-transparent px-3 py-2"
                >
                  <option>Food Processing</option>
                  <option>Out for delivery</option>
                  <option>Delivered</option>
                </select>
              </div>
              <p className="mt-3 text-sm text-zinc-500">
                {order.items
                  .map((item) => `${item.name} × ${item.quantity}`)
                  .join(", ")}
              </p>
            </article>
          ))}
          {!orders.length && (
            <p className="rounded-2xl border border-dashed p-8 text-center text-zinc-500">
              No orders match this view.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
