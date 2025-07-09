"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Smartphone, Palette, Brain, Rocket, Star, Heart, Zap, Sparkles, ArrowUp } from "lucide-react"

const floatingIcons = [
  { icon: Code, color: "text-cyan-400", size: "h-8 w-8" },
  { icon: Smartphone, color: "text-blue-400", size: "h-6 w-6" },
  { icon: Palette, color: "text-purple-400", size: "h-7 w-7" },
  { icon: Brain, color: "text-orange-400", size: "h-8 w-8" },
  { icon: Rocket, color: "text-green-400", size: "h-6 w-6" },
  { icon: Star, color: "text-yellow-400", size: "h-5 w-5" },
  { icon: Heart, color: "text-pink-400", size: "h-6 w-6" },
  { icon: Zap, color: "text-indigo-400", size: "h-7 w-7" },
]

export default function InteractiveEndAnimation() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
    }>
  >([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

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
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vy: particle.vy + 0.1, // gravity
          }))
          .filter((particle) => particle.life > 0),
      )
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isHovered) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      life: 60,
      maxLife: 60,
    }))

    setParticles((prev) => [...prev, ...newParticles])
  }

  const handleInteraction = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    createParticles(x, y)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Floating Icons */}
        {floatingIcons.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className={`absolute ${item.color} ${item.size} opacity-30 animate-float`}
              style={{
                left: `${10 + index * 12}%`,
                top: `${20 + (index % 3) * 25}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${4 + (index % 3)}s`,
              }}
            >
              <Icon />
            </div>
          )
        })}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Interactive Center Piece */}
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card
            className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 hover:border-cyan-400/50 transition-all duration-700 transform hover:scale-105 rounded-3xl overflow-hidden relative cursor-pointer"
            onClick={handleInteraction}
            style={{
              transform: isHovered
                ? `perspective(1000px) rotateX(${(mousePosition.y - 200) * 0.05}deg) rotateY(${(mousePosition.x - 200) * 0.05}deg) scale(1.05)`
                : "none",
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Particle System */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full pointer-events-none"
                style={{
                  left: particle.x,
                  top: particle.y,
                  opacity: particle.life / particle.maxLife,
                  transform: `scale(${particle.life / particle.maxLife})`,
                }}
              />
            ))}

            {/* Animated Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-20 transition-opacity duration-700 rounded-3xl blur-xl" />

            <CardContent className="p-12 text-center relative z-10">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Thanks for Exploring!
                  </span>
                </h3>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Ready to bring your ideas to life? Let's create something amazing together!
                </p>
              </div>

              {/* Interactive Elements */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="group p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105">
                  <Code className="h-8 w-8 text-cyan-400 mx-auto mb-4 group-hover:animate-bounce" />
                  <h4 className="font-bold text-white mb-2">Clean Code</h4>
                  <p className="text-gray-400 text-sm">Scalable & Maintainable</p>
                </div>
                <div className="group p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
                  <Heart className="h-8 w-8 text-purple-400 mx-auto mb-4 group-hover:animate-pulse" />
                  <h4 className="font-bold text-white mb-2">Passion Driven</h4>
                  <p className="text-gray-400 text-sm">Love What I Do</p>
                </div>
                <div className="group p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105">
                  <Rocket className="h-8 w-8 text-green-400 mx-auto mb-4 group-hover:animate-bounce" />
                  <h4 className="font-bold text-white mb-2">Innovation</h4>
                  <p className="text-gray-400 text-sm">Cutting-Edge Solutions</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-400 mb-6">Click anywhere on this card to create magic ✨</p>
                <Button
                  onClick={scrollToTop}
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <ArrowUp className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                  <span className="relative z-10">Back to Top</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Built with ❤️ by Bramwel Agina • © 2024 • Made with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </section>
  )
}
