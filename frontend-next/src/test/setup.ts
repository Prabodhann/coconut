import "@testing-library/jest-dom/vitest";

const values = new Map<string, string>();

const storage = {
  clear: () => values.clear(),
  getItem: (key: string) => values.get(key) ?? null,
  removeItem: (key: string) => values.delete(key),
  setItem: (key: string, value: string) => values.set(key, value),
};

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: storage,
});
