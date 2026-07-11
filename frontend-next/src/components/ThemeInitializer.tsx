"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    const theme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = theme === "dark" || (!theme && prefersDark);

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return null;
}
