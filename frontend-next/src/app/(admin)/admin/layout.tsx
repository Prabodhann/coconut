"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "react-toastify";
import { UserService } from "@/services/api";
import { AdminNavbar } from "@/components/AdminNavbar";
import { AdminSidebar } from "@/components/AdminSidebar";

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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const sessionIsAdmin = useSyncExternalStore(
    () => () => {},
    () => {
      const session = getSession();
      return Boolean(session.token) && session.role === "admin";
    },
    () => false,
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

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

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    setAuthenticated(false);
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
    <div className="h-[100dvh] w-full overflow-hidden bg-gray-50 flex flex-col text-slate-800 transition-colors dark:bg-slate-950 dark:text-gray-100">
      <AdminNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[18%] min-w-[200px] border-r border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors overflow-y-auto">
          <AdminSidebar />
        </div>

        <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950/50 relative overflow-y-auto p-6 transition-colors">
          {children}
        </div>
      </div>
    </div>
  );
}
