"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import { UI_CONTENT } from "@/constants/uiContent";
import { NewsletterService } from "@/services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function MobileAppsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await NewsletterService.subscribe(email);
      if (response.data.success) {
        setIsSubmitted(true);
        setEmail("");
        toast.success("Registration successful! Check your email. 🥥");
      } else {
        throw new Error(response.data.message || "Subscription failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-orange-50 via-white to-zinc-50 dark:from-orange-950/30 dark:via-zinc-950 dark:to-zinc-950 px-4 py-16">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-300/30 dark:bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-300/30 dark:bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative mx-auto max-w-2xl rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-8 md:p-12">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="mt-10 text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-zinc-900 dark:text-zinc-100"
          >
            {UI_CONTENT.APP_DOWNLOAD.COMING_SOON_TITLE}
          </motion.h1>
          <p className="whitespace-pre-line text-zinc-500 max-w-md mx-auto">
            {UI_CONTENT.APP_DOWNLOAD.COMING_SOON_SUBTITLE}
          </p>

          <div className="flex items-center justify-center gap-10 py-6">
            <div className="flex flex-col items-center gap-2">
              <img
                src={assets.play_store.src ?? assets.play_store}
                alt=""
                className="h-12 w-auto object-contain"
              />
              <span className="text-sm text-zinc-500">Android</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img
                src={assets.app_store.src ?? assets.app_store}
                alt=""
                className="h-12 w-auto object-contain"
              />
              <span className="text-sm text-zinc-500">iOS</span>
            </div>
          </div>

          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder={UI_CONTENT.APP_DOWNLOAD.NOTIFY_PLACEHOLDER}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 px-6 py-3 font-semibold text-white transition-colors"
              >
                {isLoading ? "Sending…" : UI_CONTENT.APP_DOWNLOAD.NOTIFY_BTN}
              </button>
            </form>
          ) : (
            <div className="rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-900/50 p-6 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {UI_CONTENT.APP_DOWNLOAD.SUCCESS_TITLE}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                {UI_CONTENT.APP_DOWNLOAD.SUCCESS_SUB}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
