"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [poem, setPoem] = useState("")

  const fetchPoem = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [] }),
      });

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setPoem(result);
      }
    } catch (error) {
      console.error("Error fetching poem:", error);
    }
  };

  const handleButtonClick = () => {
    setIsOpen(true);
    fetchPoem();
  };

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
          <Button onClick={handleButtonClick} className="w-full">
            Read a Poem
          </Button>
          <Button onClick={fetchPoem} className="w-full mt-2">
            Regenerate
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>A Beautiful Poem</DialogTitle>
            <DialogDescription>Enjoy this classic piece of literature</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-foreground">{poem}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
