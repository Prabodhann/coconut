"use client";

import Link from "next/link";
import { FormEvent, useSyncExternalStore, useState } from "react";
import { toast } from "react-toastify";
import { UserService } from "@/services/api";

function getSession() {
  if (typeof window === "undefined") return { token: null, role: null };
  return {
    token: localStorage.getItem("admin_token"),
    role: localStorage.getItem("admin_role"),
  };
}
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [authenticated, setAuthenticated] = useState(false);
  const sessionIsAdmin = useSyncExternalStore(
    () => () => {},
    () => {
      const session = getSession();
      return Boolean(session.token) && session.role === "admin";
    },
    () => false,
  );
  const [busy, setBusy] = useState(false);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const response = await UserService.login(
        String(values.get("email")),
        String(values.get("password")),
      );
      if (
        !response.data.success ||
        response.data.role !== "admin" ||
        !response.data.token
      )
        throw new Error("Administrator access is required.");
      localStorage.setItem("admin_token", response.data.token);
      localStorage.setItem("admin_role", "admin");
      setAuthenticated(true);
      toast.success("Welcome back, Admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }
  if (!(authenticated || sessionIsAdmin))
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-100 p-4 dark:bg-zinc-950">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl dark:bg-zinc-900"
        >
          <p className="text-sm font-bold uppercase tracking-[.2em] text-orange-500">
            Coconut
          </p>
          <h1 className="mt-2 text-3xl font-black">Admin login required</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Use an administrator account to manage Coconut.
          </p>
          <input
            required
            name="email"
            type="email"
            placeholder="Admin email"
            className="mt-6 w-full rounded-xl border bg-transparent p-3"
          />
          <input
            required
            name="password"
            type="password"
            placeholder="Password"
            className="mt-3 w-full rounded-xl border bg-transparent p-3"
          />
          <button
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    );
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href="/admin/add"
            className="text-xl font-black text-orange-500"
          >
            coconut.{" "}
            <span className="text-sm font-medium text-zinc-500">admin</span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              localStorage.removeItem("admin_role");
              setAuthenticated(false);
            }}
            className="text-sm text-red-600"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl md:grid-cols-[190px_1fr]">
        <nav
          aria-label="Admin navigation"
          className="flex gap-2 overflow-x-auto border-b p-4 md:min-h-[calc(100vh-65px)] md:flex-col md:border-b-0 md:border-r dark:border-zinc-800"
        >
          <Link
            href="/admin/add"
            className="rounded-lg px-3 py-2 hover:bg-orange-100 dark:hover:bg-zinc-800"
          >
            Add items
          </Link>
          <Link
            href="/admin/list"
            className="rounded-lg px-3 py-2 hover:bg-orange-100 dark:hover:bg-zinc-800"
          >
            List items
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-lg px-3 py-2 hover:bg-orange-100 dark:hover:bg-zinc-800"
          >
            Orders
          </Link>
        </nav>
        <main className="p-5 md:p-9">{children}</main>
      </div>
    </div>
  );
}
