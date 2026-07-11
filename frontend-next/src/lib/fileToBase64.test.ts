import { fileToBase64 } from "./fileToBase64";

describe("fileToBase64", () => {
  it("resolves the base64 data URL for a file", async () => {
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });

    const result = await fileToBase64(file);

    expect(result).toMatch(/^data:text\/plain;base64,/);
  });
});
