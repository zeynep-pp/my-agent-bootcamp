# 🧠 Agent Engineering – AI Poem Generator

This project was built as part of the Agent Engineering Bootcamp. It showcases a basic AI-powered application using **TypeScript**, **Next.js**, **Tailwind CSS**, and the **AI SDK** with OpenAI's `gpt-4o` model.

---

## ✨ Features

- 🌐 Built with Next.js 14 and TypeScript
- 🎨 Styled using Tailwind CSS
- 🧠 Integrated with OpenAI via the AI SDK
- 📜 Generates real-time AI poems about coding
- ⚡ Streams model responses for better UX

---

## 📦 Tech Stack

- **Frontend:** Next.js + TypeScript
- **Styling:** Tailwind CSS
- **AI Integration:** OpenAI via AI SDK
- **Language:** TypeScript
- **Package Manager:** PNPM

---

## 🚀 Getting Started

### 1. Create the project

```bash
npx create-next-app@latest my-project --typescript --tailwind --eslint
cd my-project
```

### 2. Install the AI SDK

```bash
pnpm install ai @ai-sdk/openai
```

---

## 🧠 Backend API Route

Create a file at: `app/api/chat/route.ts`

```ts
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
```

---

## 🎨 Frontend Component

Create a file at: `components/poem-card.tsx`

```tsx
"use client"

import { useState } from "react"
import { BookOpen, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [poem, setPoem] = useState("")
  const [loading, setLoading] = useState(false)
  const [prompt] = useState("Write a beautiful short poem about coding and AI")

  const fetchPoem = async () => {
    setPoem("")
    setLoading(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: prompt },
          ],
        }),
      });

      if(!response.ok) {
        throw new Error("Failed to fetch poem")
      }
      if (!response.body) throw new Error("No response body")
      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("0:")) {
            const content = line.slice(2)
            if(content) {
              setPoem(prev => prev + content)
            }
          }
        }
      }
      setLoading(false)
    } catch (error) {
      setPoem(`Error fetching poem: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleShowPoem = () => {
    setIsOpen(true)
    fetchPoem()
  }

  const handleRegenerate = () => {
    fetchPoem()
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Poetry Corner
          </CardTitle>
          <CardDescription>Discover beautiful poetry with just one click</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleShowPoem} className="w-full">
            Read a Poem
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>A Beautiful Poem</DialogTitle>
            <DialogDescription>Enjoy this classic piece of literature</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-foreground min-h-[120px]">{poem || (loading ? "Loading..." : "")}</pre>
            <Button onClick={handleRegenerate} disabled={loading} variant="outline" className="self-end flex items-center gap-2">
              <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
              Regenerate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

```

---

## 🔐 API Key Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Copy your API key
3. Create a `.env.local` file in the root folder:
```bash
OPENAI_API_KEY=your-actual-api-key-here
```
4. Ensure `.env.local` is added to your `.gitignore` file to prevent exposure.

---

## 🧪 Testing the App

```bash
pnpm run dev
```

- Open [http://localhost:3000](http://localhost:3000)
- Click "Generate a Poem"
- You’ll see a real-time streamed response from GPT-4o ✨

---

## 📚 Resources

- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

## 👨‍💻 Author

**Dinesh Babu Satram**  
Let’s build agents that create magic ✨  
[GitHub](https://github.com/Dinesh-Satram)

---

## 🛡️ License

This project is licensed under the MIT License.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
