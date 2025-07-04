"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Smartphone, Database, Brain, Settings, Palette, Zap, Star, TrendingUp } from "lucide-react"

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code,
    skills: [
      { name: "Java", level: 95, color: "from-orange-500 to-red-500" },
      { name: "Kotlin", level: 90, color: "from-purple-500 to-pink-500" },
      { name: "Dart", level: 88, color: "from-blue-500 to-cyan-500" },
      { name: "Python", level: 85, color: "from-green-500 to-emerald-500" },
      { name: "JavaScript", level: 92, color: "from-yellow-500 to-orange-500" },
      { name: "PHP", level: 80, color: "from-indigo-500 to-purple-500" },
      { name: "C++", level: 75, color: "from-gray-500 to-slate-500" },
    ],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Frameworks & Libraries",
    icon: Smartphone,
    skills: [
      { name: "Android SDK", level: 95, color: "from-green-500 to-emerald-500" },
      { name: "Flutter", level: 92, color: "from-blue-500 to-cyan-500" },
      { name: "React.js", level: 90, color: "from-cyan-500 to-blue-500" },
      { name: "Node.js", level: 85, color: "from-green-600 to-green-500" },
      { name: "Laravel", level: 82, color: "from-red-500 to-orange-500" },
    ],
    gradient: "from-blue-500 to-purple-500",
  },
  {
    title: "Databases & Storage",
    icon: Database,
    skills: [
      { name: "MongoDB", level: 88, color: "from-green-500 to-emerald-500" },
      { name: "MySQL", level: 90, color: "from-blue-500 to-cyan-500" },
      { name: "PostgreSQL", level: 85, color: "from-indigo-500 to-blue-500" },
      { name: "SQLite", level: 92, color: "from-gray-500 to-slate-500" },
      { name: "Firebase", level: 88, color: "from-yellow-500 to-orange-500" },
    ],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "AI & Machine Learning",
    icon: Brain,
    skills: [
      { name: "TensorFlow", level: 80, color: "from-orange-500 to-red-500" },
      { name: "scikit-learn", level: 85, color: "from-blue-500 to-cyan-500" },
      { name: "Custom Models", level: 78, color: "from-purple-500 to-pink-500" },
      { name: "Data Analysis", level: 88, color: "from-green-500 to-emerald-500" },
    ],
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Development Tools",
    icon: Settings,
    skills: [
      { name: "Git/GitHub", level: 95, color: "from-gray-700 to-gray-500" },
      { name: "Android Studio", level: 92, color: "from-green-500 to-emerald-500" },
      { name: "VS Code", level: 90, color: "from-blue-500 to-cyan-500" },
      { name: "Docker", level: 75, color: "from-blue-600 to-blue-500" },
      { name: "Netlify", level: 85, color: "from-teal-500 to-cyan-500" },
    ],
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Design & UI/UX",
    icon: Palette,
    skills: [
      { name: "Figma", level: 88, color: "from-purple-500 to-pink-500" },
      { name: "Canva", level: 85, color: "from-blue-500 to-purple-500" },
      { name: "UI/UX Design", level: 90, color: "from-pink-500 to-rose-500" },
      { name: "Prototyping", level: 87, color: "from-indigo-500 to-purple-500" },
    ],
    gradient: "from-pink-500 to-rose-500",
  },
]

export default function Skills() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [animatedLevels, setAnimatedLevels] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      const levels: { [key: string]: number } = {}
      skillCategories.forEach((category) => {
        category.skills.forEach((skill) => {
          levels[skill.name] = skill.level
        })
      })
      setAnimatedLevels(levels)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-20 px-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Technical Arsenal
              </span>
            </h2>
          </div>
          <div className="w-32 h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive toolkit of cutting-edge technologies for building
            <span className="text-cyan-400 font-semibold"> scalable</span>,
            <span className="text-purple-400 font-semibold"> intelligent</span>, and
            <span className="text-blue-400 font-semibold"> beautiful</span> applications
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon
            return (
              <Card
                key={category.title}
                className={`group bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl border-2 border-gray-700/50 hover:border-cyan-400/50 transition-all duration-700 transform hover:scale-105 cursor-pointer rounded-3xl overflow-hidden relative`}
                onMouseEnter={() => setHoveredCard(categoryIndex)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animationDelay: `${categoryIndex * 200}ms`,
                }}
              >
                {/* Animated Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
                />

                {/* Floating Particles Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 200}ms`,
                        animation:
                          hoveredCard === categoryIndex ? `float 3s ease-in-out infinite ${i * 200}ms` : "none",
                      }}
                    />
                  ))}
                </div>

                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center mb-6">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${category.gradient} mr-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                        {category.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-gray-400">Expert Level</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skill.name}
                        className="group/skill"
                        style={{
                          animationDelay: `${categoryIndex * 200 + skillIndex * 100}ms`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                            {skill.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-green-400" />
                            <span className="text-cyan-400 font-bold text-sm">{animatedLevels[skill.name] || 0}%</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                              className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                              style={{
                                width: `${animatedLevels[skill.name] || 0}%`,
                                transitionDelay: `${categoryIndex * 200 + skillIndex * 100}ms`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Category Stats */}
                  <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Average Proficiency</span>
                      <span className="text-cyan-400 font-bold">
                        {Math.round(
                          category.skills.reduce((acc, skill) => acc + skill.level, 0) / category.skills.length,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Overall Stats */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <div className="text-4xl font-bold text-cyan-400 mb-2">25+</div>
              <div className="text-gray-300">Technologies Mastered</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <div className="text-4xl font-bold text-purple-400 mb-2">3+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
