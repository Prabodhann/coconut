"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, setAuth } from "@/store/slices/authSlice";
import { UserService } from "@/services/api";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setBusy(true);
    try {
      const response =
        mode === "login"
          ? await UserService.login(email, password)
          : await UserService.register(
              String(form.get("name") ?? ""),
              email,
              password,
            );
      if (!response.data.success || !response.data.token)
        throw new Error(response.data.message || "Unable to authenticate");
      dispatch(
        setAuth({
          token: response.data.token,
          role: response.data.role || "user",
        }),
      );
      setOpen(false);
      toast.success("Welcome to Coconut");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to authenticate",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
        >
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-orange-500"
          >
            coconut<span className="text-zinc-900 dark:text-white">.</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link href="/">Home</Link>
            <Link href="/myorders">Orders</Link>
            <Link href="/app-download">Apps</Link>
            <Link
              href="/cart"
              className="rounded-full bg-zinc-900 px-4 py-2 text-white dark:bg-orange-500"
            >
              Cart
            </Link>
            {token ? (
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="text-orange-600"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-orange-600"
              >
                Sign in
              </button>
            )}
          </div>
        </nav>
      </header>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Account access"
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
        >
          <form
            onSubmit={submit}
            className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl dark:bg-zinc-900"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {mode === "register" && (
              <input
                required
                name="name"
                placeholder="Your name"
                className="mb-3 w-full rounded-xl border p-3 dark:bg-zinc-800"
              />
            )}
            <input
              required
              name="email"
              type="email"
              placeholder="Email"
              className="mb-3 w-full rounded-xl border p-3 dark:bg-zinc-800"
            />
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              className="mb-4 w-full rounded-xl border p-3 dark:bg-zinc-800"
            />
            <button
              disabled={busy}
              className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white disabled:opacity-50"
            >
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="mt-4 w-full text-sm text-orange-600"
            >
              {mode === "login"
                ? "New here? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
