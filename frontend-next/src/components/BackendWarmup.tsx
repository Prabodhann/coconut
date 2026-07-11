"use client";

import { useEffect } from "react";
import { getApiBaseUrl } from "@/services/api";

export async function warmUpServer() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 4000);

  try {
    await fetch(`${getApiBaseUrl()}/health`, { signal: controller.signal });
  } catch {
    // The free-tier backend may be waking up.
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function BackendWarmup() {
  useEffect(() => {
    void warmUpServer();
  }, []);

  return null;
}
