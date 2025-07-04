"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, User, Bot, Sparkles } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function CodeTerminal() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [robotState, setRobotState] = useState<"idle" | "thinking" | "talking">("idle")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestedQuestions = [
    "What projects has Bramwel worked on?",
    "Tell me about Bramwel's technical skills",
    "What is Bramwel's educational background?",
    "What awards has Bramwel received?",
    "How can I contact Bramwel?",
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      return () => container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (messageText: string = inputValue) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setRobotState("thinking")

    try {
      // Use environment variable for endpoint, fallback to Next.js API route
      const endpoint = process.env.NEXT_PUBLIC_THERAPY_CHAT_ENDPOINT || "/api/therapy-chat"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText.trim() }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setRobotState("talking")

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      setTimeout(() => setRobotState("idle"), 2000)
    } catch (error) {
      console.error("AI Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later!",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setRobotState("idle")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  // Calculate eye position based on mouse
  const eyeOffset = {
    x: Math.max(-8, Math.min(8, (mousePosition.x - 400) / 20)),
    y: Math.max(-6, Math.min(6, (mousePosition.y - 200) / 25)),
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ask Bramwel's AI Assistant
          </h1>
          <p className="text-gray-300">Get to know Bramwel Agina through AI-powered conversations</p>
        </div>

        {/* Enhanced Robot */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Holographic Platform */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent rounded-full blur-sm animate-pulse"></div>

            {/* Robot Container */}
            <div
              className={`relative transition-all duration-500 ${
                robotState === "thinking"
                  ? "animate-bounce"
                  : robotState === "talking"
                    ? "scale-105"
                    : "hover:scale-105"
              }`}
            >
              {/* Robot Body */}
              <div className="relative w-32 h-40 mx-auto">
                {/* Main Body */}
                <div className="absolute inset-x-4 top-8 bottom-4 bg-gradient-to-b from-gray-300 to-gray-500 rounded-2xl shadow-2xl border-2 border-gray-400">
                  {/* Chest Panel */}
                  <div className="absolute inset-x-2 top-4 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg opacity-80">
                    <div className="absolute inset-1 bg-black/20 rounded-md flex items-center justify-center">
                      <div
                        className={`w-2 h-2 rounded-full ${robotState === "thinking" ? "bg-yellow-400 animate-pulse" : robotState === "talking" ? "bg-green-400" : "bg-blue-400"}`}
                      ></div>
                    </div>
                  </div>

                  {/* Power Core */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-spin-slow shadow-lg">
                    <div className="absolute inset-1 bg-white/30 rounded-full"></div>
                  </div>
                </div>

                {/* Head */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full shadow-xl border-2 border-gray-300">
                  {/* Eyes */}
                  <div className="absolute top-4 left-3 w-4 h-4 bg-white rounded-full shadow-inner">
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full transition-all duration-200 ease-out"
                      style={{
                        transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                      }}
                    ></div>
                  </div>
                  <div className="absolute top-4 right-3 w-4 h-4 bg-white rounded-full shadow-inner">
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full transition-all duration-200 ease-out"
                      style={{
                        transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                      }}
                    ></div>
                  </div>

                  {/* Mouth */}
                  <div
                    className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-2 rounded-full transition-all duration-300 ${
                      robotState === "talking" ? "bg-green-400 animate-pulse" : "bg-gray-600"
                    }`}
                  ></div>
                </div>

                {/* Antennas */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="absolute -left-2 w-0.5 h-6 bg-gray-400"></div>
                    <div className="absolute -right-2 w-0.5 h-6 bg-gray-400"></div>
                    <div
                      className={`absolute -left-2 -top-1 w-2 h-2 rounded-full ${robotState === "thinking" ? "bg-yellow-400 animate-ping" : "bg-red-400"}`}
                    ></div>
                    <div
                      className={`absolute -right-2 -top-1 w-2 h-2 rounded-full ${robotState === "thinking" ? "bg-yellow-400 animate-ping" : "bg-red-400"}`}
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>

                {/* Arms */}
                <div
                  className={`absolute left-0 top-12 w-6 h-16 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full transform -rotate-12 transition-transform duration-500 ${
                    robotState === "talking" ? "rotate-12" : ""
                  }`}
                >
                  <div className="absolute bottom-0 w-4 h-4 bg-gray-400 rounded-full transform translate-x-1"></div>
                </div>
                <div
                  className={`absolute right-0 top-12 w-6 h-16 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full transform rotate-12 transition-transform duration-500 ${
                    robotState === "talking" ? "-rotate-12" : ""
                  }`}
                >
                  <div className="absolute bottom-0 w-4 h-4 bg-gray-400 rounded-full transform -translate-x-1"></div>
                </div>

                {/* Legs */}
                <div className="absolute -bottom-8 left-6 w-5 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full">
                  <div className="absolute bottom-0 w-6 h-3 bg-gray-700 rounded-full transform -translate-x-0.5"></div>
                </div>
                <div className="absolute -bottom-8 right-6 w-5 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full">
                  <div className="absolute bottom-0 w-6 h-3 bg-gray-700 rounded-full transform -translate-x-0.5"></div>
                </div>
              </div>

              {/* Energy Field */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-pulse ${
                  robotState === "thinking"
                    ? "border-yellow-400/50"
                    : robotState === "talking"
                      ? "border-green-400/50"
                      : ""
                }`}
                style={{ transform: "scale(1.2)" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <Card className="mb-6 p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Quick Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto p-4 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <Card className="mb-6 p-6 bg-white/10 backdrop-blur-sm border-white/20 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 animate-fade-in ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user" ? "bg-purple-500" : "bg-gradient-to-r from-cyan-400 to-blue-500"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-xs md:max-w-md ${message.sender === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-purple-500 text-white"
                          : "bg-white/20 text-white border border-white/20"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 animate-fade-in">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-2xl bg-white/20 border border-white/20">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </Card>
        )}

        {/* Input Form */}
        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about Bramwel..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
