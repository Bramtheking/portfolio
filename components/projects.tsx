"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Smartphone, Globe, Palette, Download, Star, Eye, Brain, Zap } from "lucide-react"
import Image from "next/image"

// Declare typeIcons and typeColors
const typeIcons = {
  mobile: Smartphone,
  web: Globe,
  design: Palette,
  ai: Brain,
  research: Zap,
}

const typeColors = {
  mobile: "from-green-500 to-green-600",
  web: "from-blue-500 to-blue-600",
  design: "from-purple-500 to-purple-600",
  ai: "from-orange-500 to-orange-600",
  research: "from-red-500 to-red-600",
}

// Update projects data - fix categories and add Afrilink
const projects = [
  {
    title: "Health Living App",
    description:
      "Cross-platform Flutter app tracking wellness metrics with personalized tips and progress charts. Features real-time health monitoring, AI-powered recommendations, and social wellness challenges.",
    tech: ["Flutter", "Firebase", "REST APIs", "AI/ML"],
    type: "mobile",
    image: "/assets/images/health-app.png",
    featured: false,
    rating: 4.8,
    downloads: "10K+",
    links: {
      github: "https://github.com/Bramtheking/health-living-app",
      live: "#",
      download: "https://drive.google.com/file/d/your-health-app-id/view",
    },
  },
  {
    title: "AI Detector Application",
    description:
      "Revolutionary mobile app using custom ML models to detect health markers in images with 95% accuracy. Real-time processing with cloud-based AI inference.",
    tech: ["React Native", "Python Flask", "TensorFlow", "Computer Vision"],
    type: "mobile",
    image: "/assets/images/ai-detector.png",
    featured: false,
    rating: 4.9,
    downloads: "5K+",
    links: {
      live: "https://bramwelagina.my.canva.site/myportofolio",
      download: "https://drive.google.com/file/d/your-ai-detector-id/view",
    },
  },
  {
    title: "Doctor App - Telemedicine Platform",
    description:
      "Comprehensive telemedicine solution with video consultations, appointment scheduling, secure patient records, and prescription management. Features elegant UI/UX design.",
    tech: ["Flutter", "Dart", "Firebase", "WebRTC", "UI/UX Design"],
    type: "mobile",
    image: "/assets/images/doctor-app.png",
    featured: false,
    rating: 4.7,
    downloads: "8K+",
    designProject: true,
    links: {
      github: "https://github.com/Bramtheking/doctor-app",
      download: "https://drive.google.com/file/d/your-doctor-app-id/view",
    },
  },
  // Featured Projects
  {
    title: "SCHACCS App - Student Portal",
    description:
      "Modern parent-student portal with real-time notifications, fee management, academic progress tracking, and event calendar integration.",
    tech: ["Flutter", "Firebase", "SQLite", "Push Notifications"],
    type: "mobile",
    image: "/assets/images/schaccs-app.png",
    featured: true,
    rating: 4.5,
    downloads: "12K+",
    links: {
      github: "https://github.com/Bramtheking/schaccs-app",
      download: "https://drive.google.com/file/d/your-schaccs-app-id/view",
    },
  },
  {
    title: "Allotmealafroc - Business Platform",
    description:
      "Comprehensive business networking platform connecting hotels, restaurants, and stakeholders with advanced booking systems and payment integration.",
    tech: ["Next.js", "MongoDB", "Stripe", "Netlify"],
    type: "web",
    image: "/assets/images/allotmeal.png",
    featured: true,
    rating: 4.8,
    links: {
      live: "https://allotmealafroc.netlify.app",
      github: "https://github.com/Bramtheking/allotmealafroc",
    },
  },
  {
    title: "Afrilink - African Professional Network",
    description:
      "Revolutionary professional networking platform designed specifically for African professionals. Features job matching, skill development, and business connections across the continent.",
    tech: ["Figma", "UI/UX Design", "Prototyping", "User Research"],
    type: "design",
    image: "/assets/images/afrilink.png",
    featured: true,
    rating: 4.9,
    designProject: true,
    links: {
      live: "https://www.figma.com/your-afrilink-design",
    },
  },
  {
    title: "AI Detector Website",
    description:
      "Web-based AI detection platform with drag-and-drop interface, batch processing, and detailed analytics dashboard.",
    tech: ["React.js", "Python Flask", "TensorFlow", "AWS"],
    type: "web",
    image: "/assets/images/ai-web.png",
    featured: true,
    rating: 4.8,
    links: {
      github: "https://github.com/Bramtheking/ai-detector-web",
      live: "https://ai-detector-demo.netlify.app",
    },
  },
  // AI/ML Projects - Featured
  {
    title: "AI_Human Text Detector",
    description:
      "Developed a model to distinguish AI-generated text from human-written content, achieving high accuracy. Trained BERT model on Kaggle with thousands of data to achieve excellent results.",
    tech: ["BERT", "Python", "Kaggle", "NLP", "Deep Learning"],
    type: "ai",
    image: "/assets/images/ai-text-detector.png",
    featured: false,
    rating: 5.0,
    aiProject: true,
    links: {
      live: "#",
    },
  },
  {
    title: "Loan Default Prediction Model",
    description:
      "Participated in a competitive project to develop a predictive model for loan defaults, leveraging machine learning algorithms for accurate risk assessment.",
    tech: ["Machine Learning", "Risk Assessment", "Financial AI", "Kaggle"],
    type: "ai",
    image: "/assets/images/loan-prediction.png",
    featured: false,
    rating: 5.0,
    aiProject: true,
    achievement: "Top 100 out of 10,000 participants",
    accuracy: "95% Accuracy",
    links: {
      live: "#",
    },
  },
  {
    title: "PEFRANK SACCO Android App",
    description:
      "Secure cooperative savings application with advanced encryption, transaction history, loan management, and multi-factor authentication.",
    tech: ["Java", "Android SDK", "SQLite", "Encryption"],
    type: "mobile",
    image: "/assets/images/sacco-app.png",
    rating: 4.6,
    downloads: "15K+",
    links: {
      github: "https://github.com/Bramtheking/pefrank-sacco",
      download: "https://drive.google.com/file/d/your-sacco-app-id/view",
    },
  },
  // More AI Projects
  {
    title: "Safy Model with Dapper Integration",
    description:
      "Built a robust AI model for safety assessments, integrated seamlessly with Dapper for optimized data handling. This system enables real-time analysis and recommendations.",
    tech: ["Machine Learning", "Dapper", "Real-time Analysis", "Safety AI"],
    type: "ai",
    image: "/assets/images/safety-ai.png",
    rating: 4.9,
    aiProject: true,
    links: {
      live: "#",
    },
  },
  {
    title: "AI Game Time Predictor",
    description:
      "Designed an AI model to predict gaming session durations based on user behavior data. The model aids in understanding user engagement and optimizing game recommendations.",
    tech: ["Predictive Analytics", "User Behavior", "Python", "Data Science"],
    type: "ai",
    image: "/assets/images/game-predictor.png",
    rating: 4.8,
    aiProject: true,
    links: {
      live: "#",
    },
  },
  {
    title: "Coffee Shop Mobile Design",
    description:
      "Elegant café ordering system with intuitive menu browsing, customizable orders, loyalty rewards, and seamless checkout experience.",
    tech: ["Figma", "Canva", "UI/UX", "Prototyping"],
    type: "design",
    image: "/assets/images/coffee-design.png",
    rating: 4.9,
    designProject: true,
    links: {
      live: "https://www.figma.com/your-coffee-design",
    },
  },
  {
    title: "Online Bike Shopping Design",
    description:
      "Modern e-commerce platform design with advanced filtering, AR bike preview concepts, and streamlined checkout experience. Focus on user-centered design principles.",
    tech: ["Figma", "UI/UX Design", "Prototyping", "User Research"],
    type: "design",
    image: "/assets/images/bike-shop.png",
    rating: 4.7,
    designProject: true,
    links: {
      live: "https://www.figma.com/your-bike-design",
    },
  },
  {
    title: "School Management System",
    description:
      "Comprehensive educational platform with student management, grade tracking, attendance monitoring, and parent communication tools.",
    tech: ["React.js", "MongoDB", "Express.js", "Socket.io"],
    type: "web",
    image: "/assets/images/school-system.png",
    rating: 4.6,
    links: {
      github: "https://github.com/Bramtheking/school-management",
      live: "https://school-system-demo.netlify.app",
    },
  },
  // AI Research Projects - Display Only
  {
    title: "Simulating Smell: Electromagnetic Wave Olfactory Device",
    description:
      "Theoretical device using terahertz-range electromagnetic waves to simulate smell by directly stimulating olfactory receptors. Bypasses volatile chemicals through quantum tunneling mechanisms.",
    tech: ["Electromagnetic Waves", "Quantum Physics", "Olfactory Science", "VR Integration"],
    type: "research",
    image: "/assets/images/smell-simulation.png",
    featured: false,
    rating: 5.0,
    research: true,
    year: "2024",
    links: {},
  },
  {
    title: "Hybrid Census Technology Solution",
    description:
      "Revolutionary census methodology combining administrative data, geospatial analysis, and statistical modeling. Achieves 96-98% coverage with 90% cost reduction.",
    tech: ["Data Analytics", "Geospatial Tech", "Statistical Modeling", "Government Tech"],
    type: "research",
    image: "/assets/images/census-tech.png",
    featured: false,
    rating: 5.0,
    research: true,
    year: "2025",
    links: {},
  },
  {
    title: "Baby-Like AI System (BLAIS)",
    description:
      "Groundbreaking AI system that learns like a newborn through experience-driven associative learning in 3D environments. Explores emergent consciousness through structured experiences.",
    tech: ["Artificial Intelligence", "Machine Learning", "Cognitive Science", "3D Simulation"],
    type: "research",
    image: "/assets/images/baby-ai.png",
    featured: false,
    rating: 5.0,
    research: true,
    year: "2025",
    links: {},
  },
]

// Update the main component to show featured projects first
export default function Projects() {
  const [filter, setFilter] = useState("all")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.type === filter)
  const featuredProjects = projects.filter((project) => project.featured)
  const nonFeaturedProjects = projects.filter((project) => !project.featured)

  return (
    <section className="py-20 px-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
          </div>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A showcase of innovative solutions across
            <span className="text-cyan-400 font-semibold"> mobile</span>,
            <span className="text-purple-400 font-semibold"> web</span>,
            <span className="text-pink-400 font-semibold"> design</span>,
            <span className="text-orange-400 font-semibold"> AI/ML</span>, and
            <span className="text-green-400 font-semibold"> research</span> platforms
          </p>
        </div>

        {/* Enhanced Filter Buttons */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-2 p-2 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50">
            {["all", "mobile", "web", "design", "ai", "research"].map((type) => (
              <Button
                key={type}
                onClick={() => setFilter(type)}
                variant={filter === type ? "default" : "ghost"}
                className={`rounded-xl px-8 py-3 transition-all duration-500 font-semibold ${
                  filter === type
                    ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {type === "ai" ? "AI/ML" : type.charAt(0).toUpperCase() + type.slice(1)}
                {type !== "all" && (
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                    {projects.filter((p) => p.type === type).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* All Projects Grid */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              All Projects
            </span>
          </h3>

          {/* Featured Projects within All Projects */}
          {filter === "all" && (
            <div className="mb-16">
              <h4 className="text-2xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  🌟 Featured Projects
                </span>
              </h4>
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {featuredProjects.map((project, index) => {
                  const TypeIcon = typeIcons[project.type as keyof typeof typeIcons]
                  const typeColor = typeColors[project.type as keyof typeof typeColors]

                  return (
                    <Card
                      key={`featured-${project.title}`}
                      className="group bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border-2 border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-700 transform hover:scale-105 overflow-hidden rounded-3xl relative"
                      onMouseEnter={() => setHoveredProject(index)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-black font-bold text-sm">
                          <Star className="h-4 w-4" />
                          {project.research
                            ? "Research"
                            : project.aiProject
                              ? "AI/ML"
                              : project.designProject
                                ? "Design"
                                : "Featured"}
                        </div>
                      </div>

                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                        {/* Project Type Badge */}
                        <div className="absolute top-4 right-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-r ${typeColor} shadow-lg`}>
                            <TypeIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        {/* Rating & Downloads */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white font-semibold">{project.rating}</span>
                          </div>
                          {project.downloads && (
                            <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                              <span className="text-cyan-400 font-semibold">{project.downloads}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed line-clamp-3">{project.description}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 rounded-full text-xs text-gray-300 font-mono hover:border-cyan-400/50 transition-all duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          {project.links.github && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 bg-transparent rounded-xl"
                              asChild
                            >
                              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-2" />
                                Code
                              </a>
                            </Button>
                          )}
                          {project.links.live && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl"
                              asChild
                            >
                              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                {project.designProject ? "View Design" : "Live"}
                              </a>
                            </Button>
                          )}
                          {project.links.download && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl"
                              asChild
                            >
                              <a href={project.links.download} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                APK
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Regular Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(filter === "all" ? nonFeaturedProjects : filteredProjects.filter((p) => !p.featured)).map(
              (project, index) => {
                const TypeIcon = typeIcons[project.type as keyof typeof typeIcons]
                const typeColor = typeColors[project.type as keyof typeof typeColors]

                return (
                  <Card
                    key={project.title}
                    className="group bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-700 transform hover:scale-105 overflow-hidden rounded-3xl relative"
                    onMouseEnter={() => setHoveredProject(index + 100)}
                    onMouseLeave={() => setHoveredProject(null)}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute top-4 right-4">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${typeColor} shadow-lg`}>
                          <TypeIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {project.rating && (
                        <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-white text-sm font-semibold">{project.rating}</span>
                        </div>
                      )}

                      {(project.research || project.aiProject || project.designProject) && (
                        <div className="absolute top-4 left-4">
                          <div
                            className={`px-2 py-1 ${
                              project.research
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : project.aiProject
                                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                                  : "bg-gradient-to-r from-purple-500 to-pink-500"
                            } rounded-full text-white text-xs font-bold`}
                          >
                            {project.research ? "Research" : project.aiProject ? "AI/ML" : "Design"}
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-2">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-800/50 border border-gray-600/50 rounded-full text-xs text-gray-300 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800/50 border border-gray-600/50 rounded-full text-xs text-gray-400">
                            +{project.tech.length - 3}
                          </span>
                        )}
                      </div>

                      {project.research ? (
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl">
                            <Zap className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 font-semibold text-sm">AI Research</span>
                          </div>
                        </div>
                      ) : project.aiProject ? (
                        <div className="flex items-center justify-center">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl flex-1"
                            asChild
                          >
                            <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                              <Brain className="h-4 w-4 mr-1" />
                              AI Model
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {project.links.github && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 bg-transparent rounded-xl flex-1"
                              asChild
                            >
                              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-1" />
                                Code
                              </a>
                            </Button>
                          )}
                          {project.links.live && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl flex-1"
                              asChild
                            >
                              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                {project.designProject ? "Design" : "Live"}
                              </a>
                            </Button>
                          )}
                          {project.links.download && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl"
                              asChild
                            >
                              <a href={project.links.download} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              },
            )}
          </div>
        </div>

        {/* Project Stats */}
        <div className="mt-20 text-center">
          <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <div className="text-4xl font-bold text-cyan-400 mb-2">{projects.length}</div>
              <div className="text-gray-300">Total Projects</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
              <div className="text-gray-300">Total Downloads</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <div className="text-4xl font-bold text-blue-400 mb-2">4.7</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <div className="text-4xl font-bold text-orange-400 mb-2">4</div>
              <div className="text-gray-300">UI/UX Designs</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <div className="text-4xl font-bold text-green-400 mb-2">3</div>
              <div className="text-gray-300">Research Projects</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
