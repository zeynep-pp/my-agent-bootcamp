"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PoemCard() {
  const [showPoem, setShowPoem] = useState(false);
  const poemContainerRef = useRef<HTMLDivElement>(null);

  const { messages, append, reload, status } = useChat({
    api: "/api/chat",
    onFinish: () => {
      setShowPoem(true);
    },
  });

  const currentPoem =
    messages.find((m) => m.role === "assistant")?.content || "";

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (poemContainerRef.current && currentPoem) {
      poemContainerRef.current.scrollTop =
        poemContainerRef.current.scrollHeight;
    }
  }, [currentPoem]);

  const handleGeneratePoem = async () => {
    setShowPoem(true);
    await append({
      role: "user",
      content: "Please write me a beautiful poem.",
    });
  };

  const handleRegeneratePoem = async () => {
    await reload();
  };

  const handleHidePoem = () => {
    setShowPoem(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Discover a Poem</CardTitle>
        <CardDescription>
          Click the button below to generate a unique poem with AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showPoem && (
          <Button
            onClick={handleGeneratePoem}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Generating Poem..." : "Generate Poem"}
          </Button>
        )}
        {showPoem && (
          <div
            ref={poemContainerRef}
            className="whitespace-pre-wrap text-sm text-muted-foreground max-h-60 overflow-y-auto p-2 border rounded-md scroll-smooth"
          >
            {currentPoem}
            {isLoading && (
              <div className="text-center text-xs text-gray-500 mt-2">
                ✨ Creating your poem...
              </div>
            )}
          </div>
        )}
      </CardContent>
      {showPoem && (
        <CardFooter className="space-x-2">
          <Button
            onClick={handleRegeneratePoem}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Regenerating..." : "Regenerate"}
          </Button>
          <Button
            onClick={handleHidePoem}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Hide Poem
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}