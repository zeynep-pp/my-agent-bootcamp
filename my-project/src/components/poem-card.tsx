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
