import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Received messages:", messages);

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      onFinish({ text }) {
        console.log("AI generated poem:", text);
      },
      onError({ error }) {
        console.error("AI error:", error);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("API error:", error);
    return new Response('3:"An error occurred."', { status: 500 });
  }
}