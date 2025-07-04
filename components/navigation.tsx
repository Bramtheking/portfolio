"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Code, Phone, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Reduce navigation items by grouping them
const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Code", href: "#code-terminal" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    // Update active section based on scroll position
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.substring(1))
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-black/90 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl shadow-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToSection("#home")}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative p-3 bg-black rounded-2xl">
                <Code className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Bramwel
              </span>
              <div className="text-xs text-gray-400 font-mono">Software Engineer</div>
            </div>
          </div>

          {/* Always Visible Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium relative group ${
                  activeSection === item.href.substring(1) ? "text-cyan-400" : "text-gray-300 hover:text-white"
                }`}
              >
                {activeSection === item.href.substring(1) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-400/30" />
                )}
                <span className="relative z-10">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Enhanced Hire Me Button - Always Visible on Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 hover:from-cyan-600 hover:via-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">Hire Me</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2">
                <DropdownMenuItem className="rounded-xl p-4 hover:bg-gray-800/50 transition-colors duration-300">
                  <a href="tel:+254741797609" className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Call Me</div>
                      <div className="text-sm text-gray-400">+254 741 797 609</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl p-4 hover:bg-gray-800/50 transition-colors duration-300">
                  <a href="mailto:bramwela8@gmail.com" className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Email Me</div>
                      <div className="text-sm text-gray-400">bramwela8@gmail.com</div>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button - Only for small screens */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-gray-800/50 rounded-xl p-3"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Enhanced Mobile Navigation - Only shows on small screens */}
        {isOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50 rounded-b-3xl">
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    activeSection === item.href.substring(1)
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {/* Mobile Hire Me Options */}
              <div className="pt-4 space-y-3">
                <a
                  href="tel:+254741797609"
                  className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">Call: +254 741 797 609</span>
                </a>
                <a
                  href="mailto:bramwela8@gmail.com"
                  className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
                >
                  <Mail className="h-5 w-5" />
                  <span className="font-semibold">Email: bramwela8@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
