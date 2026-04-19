const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function run() {
  try {
    const res = await groq.chat.completions.create({
      messages: [{ role: 'user', content: [{ type: "text", text: "What is this image?" }, { type: "image_url", image_url: { url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Hamburger_%28black_bg%29.jpg" } }]}],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct', max_tokens: 20
    });
    console.log("SUCCESS:", res.choices[0].message.content);
  } catch (e) {
    console.log("ERROR: " + e.message);
  }
}
run();
