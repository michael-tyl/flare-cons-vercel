"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User, Trash, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({ streamProtocol: 'text' })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={cn("flex flex-col h-screen", isDarkMode ? "dark" : "")}>
      <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center">
          <Bot className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold">AI Chatbot</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <Bot className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p>Type a message to start chatting with the AI assistant.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "flex items-start max-w-[80%] rounded-lg p-4",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted dark:bg-gray-800",
                  )}
                >
                  <div className="mr-3 mt-0.5">
                    {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div className="prose dark:prose-invert prose-sm">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-[80%] rounded-lg p-4 bg-muted dark:bg-gray-800">
                <div className="mr-3 mt-0.5">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          )}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
              <p>Error: {error.message || "Something went wrong. Please try again."}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t dark:border-gray-700 bg-background">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1 min-h-[60px] max-h-[200px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  /* eslint-disable @typescript-eslint/no-explicit-any */
                  handleSubmit(e as any)
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-12 w-12"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
              {messages.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-12"
                  onClick={() => window.location.reload()}
                  aria-label="Clear chat"
                >
                  <Trash className="h-5 w-5" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </footer>
    </div>
  )
}

