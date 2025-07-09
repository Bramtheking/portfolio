"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Mail, Eye, ChevronDown } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  const [text, setText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const fullTexts = [
    "Hi, I'm Bramwel — I build sleek mobile & web experiences",
    "I create intelligent systems & data-driven UIs",
    "I craft innovative solutions with cutting-edge tech",
  ]

  useEffect(() => {
    let i = 0
    const currentText = fullTexts[currentIndex]
    const timer = setInterval(() => {
      if (i < currentText.length) {
        setText(currentText.slice(0, i + 1))
        i++
      } else {
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % fullTexts.length)
          setText("")
        }, 2000)
        clearInterval(timer)
      }
    }, 80)

    return () => clearInterval(timer)
  }, [currentIndex])

  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 8 + 12,
  }))

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleDownloadResume = () => {
    const link = document.createElement("a")
    link.href = "/assets/resume/Bramwel_Agina_Resume.pdf"
    link.download = "Bramwel_Agina_Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Simplified Animated Background */}
      <div className="absolute inset-0">
        {/* Subtle Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Reduced Floating Particles */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.x}%`,
              top: `${element.y}%`,
              animation: `float ${element.duration}s ease-in-out infinite ${element.delay}s`,
            }}
          />
        ))}

        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Profile Photo - Fixed positioning */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-full blur opacity-60 group-hover:opacity-80 transition duration-700 animate-pulse"></div>
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-3 border-white/10 backdrop-blur-sm">
              <Image
                src="/assets/images/bramwel-photo.jpg"
                alt="Bramwel Agina"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-black flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 mb-6 animate-pulse">
            <div className="bg-black/80 backdrop-blur-sm rounded-full px-8 py-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 font-mono text-sm font-bold">
                {"<FullStack Developer />"}
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {text}
            </span>
            <span className="animate-pulse text-cyan-400">|</span>
          </h1>

          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
              Software Engineer with <span className="text-cyan-400 font-bold">3+ years</span> of experience crafting
              <span className="text-purple-400 font-bold"> high-performance mobile apps</span>,
              <span className="text-blue-400 font-bold"> full-stack platforms</span>, and
              <span className="text-pink-400 font-bold"> AI-powered solutions</span>.
            </p>

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {["🚀 Mobile Apps", "🌐 Web Platforms", "🤖 AI/ML Solutions", "🎨 UI/UX Design"].map((item, index) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-full border border-gray-600/50 text-gray-300 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button
            size="lg"
            onClick={() => scrollToSection("projects")}
            className="group bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white border-0 px-10 py-4 rounded-full transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/25 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Eye className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold text-lg">View Projects</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadResume}
            className="group border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black px-10 py-4 rounded-full transition-all duration-500 transform hover:scale-110 bg-black/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-cyan-400/25"
          >
            <Download className="mr-3 h-6 w-6 group-hover:animate-bounce" />
            <span className="font-semibold text-lg">Download Resume</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("contact")}
            className="group border-2 border-purple-400/50 text-purple-400 hover:bg-purple-400 hover:text-black px-10 py-4 rounded-full transition-all duration-500 transform hover:scale-110 bg-black/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-400/25"
          >
            <Mail className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold text-lg">Contact Me</span>
          </Button>
        </div>

        <div className="animate-bounce">
          <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30">
            <ChevronDown className="h-8 w-8 text-cyan-400" />
          </div>
        </div>
      </div>
    </section>
  )
}
