const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyB8JItBXhgYbSe4o3Do9M_bOQIXxIJbcsI");
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch (e) {
    console.error("1.5-flash-latest error:", e.message);
  }
  
  try {
    const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result2 = await model2.generateContent("hello");
    console.log("gemini-pro success!");
  } catch(e) {
    console.error("gemini-pro error:", e.message);
  }
}
run();
