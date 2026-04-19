const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function run() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an AI. Return JSON like {"itemIds":[]}' },
        { role: 'user', content: [
            { type: "text", text: "Look at this image." },
            { type: "image_url", image_url: { url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=" } }
        ]}
      ],
      model: 'llama-3.2-90b-vision-preview',
      response_format: { type: 'json_object' }
    });
    console.log("Success:", chatCompletion.choices[0]?.message?.content);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
