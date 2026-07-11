"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderService } from "@/services/api";
import { VercelV0Chat } from "@/components/VercelV0Chat";
import { ExploreMenu } from "@/components/ExploreMenu";
import { FoodDisplay } from "@/components/FoodDisplay";
import { AppDownloadPromo } from "@/components/AppDownloadPromo";

export function HomePage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [aiIds, setAiIds] = useState<string[] | null>(null);

  function handleAiResult(itemIds: string[]) {
    setAiIds(itemIds);
    setQuery("");
    document
      .getElementById("food-display")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-4 w-full pt-6">
      <section className="w-full flex justify-center py-8">
        <VercelV0Chat onAiResult={handleAiResult} />
      </section>

      <div className="container mx-auto px-4 md:px-8 space-y-6">
        <ExploreMenu setCategory={setCategory} category={category} />
        <FoodDisplay
          category={category}
          searchQuery={query}
          aiItemIds={aiIds}
        />
        <AppDownloadPromo />
      </div>
    </div>
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
