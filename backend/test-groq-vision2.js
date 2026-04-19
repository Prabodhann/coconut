const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function run() {
  const models = ['llama-3.3-70b-versatile', 'meta-llama/llama-4-scout-17b-16e-instruct', 'openai/gpt-oss-20b', 'qwen/qwen3-32b'];
  for (let m of models) {
    try {
      await groq.chat.completions.create({
        messages: [{ role: 'user', content: [{ type: "text", text: "Look at this image." }, { type: "image_url", image_url: { url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=" } }]}],
        model: m, max_tokens: 10
      });
      console.log(m + " SUCCESS");
    } catch (e) {
      console.log(m + " ERROR: " + e.message);
    }
  }
}
run();
