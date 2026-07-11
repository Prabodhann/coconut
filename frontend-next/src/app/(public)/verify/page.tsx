import { Suspense } from "react";
import { VerifyPageContent } from "@/components/StorefrontPages";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyPageContent />
    </Suspense>
  );
}
