"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { OrderService, UserService } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCartItem, removeCartItem } from "@/store/slices/cartSlice";
import { VercelV0Chat } from "@/components/VercelV0Chat";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function HomePage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.food);
  const cart = useAppSelector((s) => s.cart.items);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [aiIds, setAiIds] = useState<string[] | null>(null);
  const categories = ["All", ...new Set(list.map((item) => item.category))];
  const food = list.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      (!query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())) &&
      (!aiIds || aiIds.includes(item._id)),
  );
  function handleAiResult(itemIds: string[]) {
    setAiIds(itemIds);
    setQuery("");
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-100 via-amber-50 to-white px-4 py-14 dark:from-orange-950/50 dark:via-zinc-950 dark:to-zinc-950">
        <VercelV0Chat onAiResult={handleAiResult} />
      </section>
      <section id="menu" className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Today&apos;s menu</h2>
            <p className="mt-1 text-zinc-500">
              Made to order, selected for you.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm ${category === item ? "bg-orange-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <p className="py-16 text-center text-zinc-500">Loading the menu…</p>
        ) : food.length === 0 ? (
          <p className="py-16 text-center text-zinc-500">
            No dishes match that craving yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {food.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-44 bg-zinc-100 dark:bg-zinc-800">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between gap-3">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <b className="text-orange-600">{money(item.price)}</b>
                  </div>
                  <p className="mt-2 min-h-10 text-sm text-zinc-500">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {cart[item._id] ? (
                      <div className="flex items-center gap-3 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
                        <button
                          aria-label={`Remove ${item.name}`}
                          onClick={() => dispatch(removeCartItem(item._id))}
                          className="h-8 w-8 rounded-full bg-white dark:bg-zinc-700"
                        >
                          −
                        </button>
                        <span>{cart[item._id]}</span>
                        <button
                          aria-label={`Add ${item.name}`}
                          onClick={() => dispatch(addCartItem(item._id))}
                          className="h-8 w-8 rounded-full bg-orange-500 text-white"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        aria-label={`Add ${item.name}`}
                        onClick={() => dispatch(addCartItem(item._id))}
                        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-orange-500"
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function CartPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const items = useAppSelector((s) => s.cart.items);
  const food = useAppSelector((s) => s.food.list);
  const rows = food.filter((item) => items[item._id] > 0);
  const subtotal = rows.reduce(
    (sum, item) => sum + item.price * items[item._id],
    0,
  );
  const delivery = subtotal ? 5 : 0;
  return (
    <section className="mx-auto min-h-[60vh] max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-black">Your cart</h1>
      {!rows.length ? (
        <div className="mt-8 rounded-3xl border border-dashed p-12 text-center">
          <p className="text-lg">
            Your cart is waiting for something delicious.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-orange-500 px-5 py-3 text-white"
          >
            Explore menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="divide-y rounded-3xl border dark:border-zinc-800">
            {rows.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-100">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-zinc-500">{money(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={`Remove ${item.name}`}
                    onClick={() => dispatch(removeCartItem(item._id))}
                    className="rounded-full border px-3 py-1"
                  >
                    −
                  </button>
                  <span>{items[item._id]}</span>
                  <button
                    aria-label={`Add ${item.name}`}
                    onClick={() => dispatch(addCartItem(item._id))}
                    className="rounded-full border px-3 py-1"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-3xl bg-zinc-900 p-6 text-white">
            <h2 className="text-xl font-bold">Order summary</h2>
            <p className="mt-5 flex justify-between">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </p>
            <p className="mt-3 flex justify-between">
              <span>Delivery</span>
              <span>{money(delivery)}</span>
            </p>
            <hr className="my-5 border-zinc-700" />
            <p className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{money(subtotal + delivery)}</span>
            </p>
            <button
              onClick={() => router.push("/order")}
              className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold"
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export function CheckoutPageContent() {
  const router = useRouter();
  const items = useAppSelector((s) => s.cart.items);
  const food = useAppSelector((s) => s.food.list);
  const token = useAppSelector((s) => s.auth.token);
  const total =
    food.reduce((sum, item) => sum + (items[item._id] || 0) * item.price, 0) +
    5;
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      toast.info("Please sign in before checking out.");
      return;
    }
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const address = Object.fromEntries(form.entries());
      const orderItems = food
        .filter((item) => items[item._id])
        .map((item) => ({ ...item, quantity: items[item._id] }));
      const response = await OrderService.place({
        address,
        items: orderItems,
        amount: total,
      });
      const sessionUrl = response.data?.session_url;
      if (sessionUrl) window.location.assign(sessionUrl);
      else router.push("/myorders");
    } catch {
      toast.error("We could not start your checkout. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black">Delivery information</h1>
      <form
        onSubmit={submit}
        className="mt-8 grid gap-4 rounded-3xl border p-6 dark:border-zinc-800 sm:grid-cols-2"
      >
        {[
          ["firstName", "First name"],
          ["lastName", "Last name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["street", "Street", "sm:col-span-2"],
          ["city", "City"],
          ["state", "State"],
          ["zipcode", "ZIP code"],
          ["country", "Country"],
        ].map(([name, label, span]) => (
          <label key={name} className={span}>
            <span className="mb-1 block text-sm font-medium">{label}</span>
            <input
              required
              type={name === "email" ? "email" : "text"}
              name={name}
              defaultValue={name === "country" ? "India" : ""}
              className="w-full rounded-xl border bg-transparent p-3"
            />
          </label>
        ))}
        <button
          disabled={busy}
          className="sm:col-span-2 mt-3 rounded-xl bg-orange-500 py-3 font-semibold text-white"
        >
          {busy ? "Preparing checkout…" : `Pay ${money(total)}`}
        </button>
      </form>
    </section>
  );
}

export function OrdersPageContent() {
  const [orders, setOrders] = useState<
    Array<{
      _id: string;
      amount: number;
      status: string;
      date: string;
      items: Array<{ name: string; quantity: number }>;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    OrderService.mine()
      .then((r) => setOrders(r.data.data || r.data.orders || []))
      .catch(() => toast.error("Sign in to see your orders."))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="mx-auto min-h-[60vh] max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-black">Your orders</h1>
      {loading ? (
        <p className="mt-8 text-zinc-500">Loading orders…</p>
      ) : !orders.length ? (
        <p className="mt-8 rounded-2xl border border-dashed p-8 text-zinc-500">
          No orders yet. Your next favourite meal is waiting.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-2xl border p-5 dark:border-zinc-800"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-bold">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
                  {order.status}
                </span>
              </div>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
                {order.items
                  .map((item) => `${item.name} × ${item.quantity}`)
                  .join(", ")}
              </p>
              <p className="mt-3 font-bold">{money(order.amount)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function VerifyPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your payment…");
  useEffect(() => {
    OrderService.verify(params.get("success"), params.get("orderId"))
      .then((r) => {
        setMessage(
          r.data.success
            ? "Payment confirmed. Your kitchen is getting started!"
            : "Payment was not confirmed.",
        );
        if (r.data.success) setTimeout(() => router.replace("/myorders"), 1200);
      })
      .catch(() =>
        setMessage(
          "We could not verify this payment. Please check your orders.",
        ),
      );
  }, [params, router]);
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-black">Verify order</h1>
        <p className="mt-4 text-zinc-500">{message}</p>
      </div>
    </section>
  );
}

export function ProfilePageContent() {
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    UserService.profile()
      .then((r) => setProfile(r.data.data || r.data.user || {}))
      .catch(() => toast.info("Sign in to manage your profile."));
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await UserService.updateProfile(
        Object.fromEntries(new FormData(event.currentTarget).entries()),
      );
      toast.success("Profile updated");
    } catch {
      toast.error("Unable to update your profile");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-black">Your profile</h1>
      <form
        onSubmit={submit}
        className="mt-8 space-y-4 rounded-3xl border p-6 dark:border-zinc-800"
      >
        {[
          ["name", "Name"],
          ["email", "Email"],
          ["phone", "Phone"],
        ].map(([name, label]) => (
          <label key={name} className="block">
            <span className="mb-1 block text-sm font-medium">{label}</span>
            <input
              name={name}
              type={name === "email" ? "email" : "text"}
              defaultValue={profile[name] || ""}
              className="w-full rounded-xl border bg-transparent p-3"
            />
          </label>
        ))}
        <button
          disabled={busy}
          className="w-full rounded-xl bg-zinc-900 py-3 font-semibold text-white dark:bg-orange-500"
        >
          {busy ? "Saving…" : "Save profile"}
        </button>
      </form>
    </section>
  );
}

export function AppsPageContent() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-[.25em] text-orange-600">
        Coconut on the go
      </p>
      <h1 className="mt-4 text-4xl font-black">
        Your favourites, in your pocket.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-zinc-500">
        The Coconut mobile experience is being prepared with the same care as
        your next order.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = String(new FormData(e.currentTarget).get("email"));
          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || ""}/api/newsletter/subscribe`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              },
            );
            toast.success("You are on the list!");
          } catch {
            toast.error("Please try again shortly.");
          }
        }}
        className="mx-auto mt-8 flex max-w-md gap-2"
      >
        <input
          required
          type="email"
          name="email"
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-xl border bg-transparent p-3"
        />
        <button className="rounded-xl bg-orange-500 px-5 font-semibold text-white">
          Notify me
        </button>
      </form>
    </section>
  );
}
