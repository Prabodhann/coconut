"use client";

import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { OrderService } from "@/services/api";
import { UI_CONTENT } from "@/constants/uiContent";
import { SkeletonMyOrders } from "@/components/SkeletonMyOrders";

interface Order {
  _id: string;
  orderId?: string;
  amount: number;
  status: string;
  date: string;
  items: Array<{ name: string; quantity: number }>;
}

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.mine()
      .then((r) => setOrders(r.data.data || r.data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SkeletonMyOrders />;
  }

  return (
    <div className="container mx-auto px-4 md:px-8 my-12 min-h-[60vh]">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {UI_CONTENT.MY_ORDERS.TITLE}
      </h2>
      <div className="mt-8 flex flex-col gap-4">
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-zinc-500">
            {UI_CONTENT.MY_ORDERS.NO_ORDERS}
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-1 sm:grid-cols-[50px_1.5fr_1fr_1fr_1.5fr_1fr_auto] items-center gap-4 sm:gap-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5"
            >
              <img
                src={assets.parcel_icon.src ?? assets.parcel_icon}
                alt=""
                className="w-10"
              />
              <p className="text-xs">
                <span className="font-mono rounded bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 text-orange-600 dark:text-orange-400">
                  #{order.orderId || order._id.slice(-6).toUpperCase()}
                </span>
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {order.items
                  .map((item) => `${item.name} x ${item.quantity}`)
                  .join(", ")}
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                ₹{order.amount}.00
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {UI_CONTENT.MY_ORDERS.ITEMS_PREFIX}
                {order.items.length}
              </p>
              <p className="text-sm">
                <span className="text-orange-500">●</span>{" "}
                <b className="font-medium">{order.status}</b>
              </p>
              <button className="rounded-md bg-orange-50 dark:bg-zinc-800 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 justify-self-start whitespace-nowrap">
                {UI_CONTENT.MY_ORDERS.TRACK_ORDER_BTN}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
