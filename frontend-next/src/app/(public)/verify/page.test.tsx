import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("VerifyPage", () => {
  it("wraps the search-params-dependent content in a Suspense boundary", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/(public)/verify/page.tsx"),
      "utf8",
    );

    expect(source).toContain("Suspense");
    expect(source).toMatch(
      /<Suspense[^>]*>[\s\S]*<VerifyPageContent[\s\S]*<\/Suspense>/,
    );
  });
});
