import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white py-10 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row">
        <div>
          <p className="text-lg font-black text-orange-500">Coconut</p>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Thoughtfully crafted food delivery, from craving to doorstep.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-zinc-500">
          <Link href="/profile">Profile</Link>
          <Link href="/app-download">Mobile apps</Link>
          <Link href="/admin/add">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
