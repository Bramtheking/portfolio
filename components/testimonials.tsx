"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, Building, TrendingUp, Users, Award } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO of TechStart",
    company: "TechStart Inc.",
    content:
      "Bramwel delivered our mobile app ahead of schedule with clean, maintainable code. His attention to detail and problem-solving skills are exceptional. The app has received over 10,000 downloads in the first month!",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    project: "Health Living App",
    impact: "10K+ Downloads",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Michael Chen",
    role: "Founder of HealthCo",
    company: "HealthCo Solutions",
    content:
      "His UI/UX designs brought our product to life; engagement soared by 40%. Bramwel's ability to understand user needs and translate them into beautiful interfaces is remarkable.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    project: "AI Detector App",
    impact: "40% Engagement Boost",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Medical Director",
    company: "MediCare Plus",
    content:
      "The telemedicine platform Bramwel developed has revolutionized our patient care. The seamless video consultations and secure patient records have improved our efficiency by 60%.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    project: "Doctor App",
    impact: "60% Efficiency Gain",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "James Wilson",
    role: "CTO of FinanceApp",
    company: "FinTech Solutions",
    content:
      "Exceptional problem-solving skills and attention to detail. Bramwel's work on our SACCO app has processed over $2M in transactions with zero security incidents. Highly recommended!",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    project: "PEFRANK SACCO App",
    impact: "$2M+ Processed",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Lisa Thompson",
    role: "Product Manager",
    company: "EduTech Innovations",
    content:
      "Professional, reliable, and delivers high-quality solutions consistently. The school management system has streamlined our operations and improved parent-teacher communication significantly.",
    rating: 4,
    avatar: "/placeholder.svg?height=80&width=80",
    project: "Schaccs App",
    impact: "500+ Schools Using",
    color: "from-blue-500 to-purple-500",
  },
  {
    name: "Robert Martinez",
    role: "Business Owner",
    company: "Allotmeal Afroc",
    content:
      "Bramwel transformed our business with the networking platform. We've connected over 1000 businesses and processed thousands of bookings. His technical expertise is outstanding.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    project: "Allotmeal Platform",
    impact: "1000+ Businesses Connected",
    color: "from-teal-500 to-cyan-500",
  },
]

export default function Testimonials() {
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length

  return (
    <section className="py-20 px-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Client Success Stories
              </span>
            </h2>
          </div>
          <div className="w-32 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 mx-auto rounded-full mb-6" />

          {/* Overall Rating Display */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-8 w-8 ${
                    i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400">{averageRating.toFixed(1)}</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400">{testimonials.length}</div>
              <div className="text-gray-400">Happy Clients</div>
            </div>
          </div>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real feedback from clients who've experienced the impact of innovative solutions
          </p>
        </div>

        {/* Testimonials Grid - All Visible with Animations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-700 transform hover:scale-105 overflow-hidden rounded-3xl relative"
              style={{
                animationDelay: `${index * 200}ms`,
              }}
            >
              {/* Animated Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
              />

              {/* Floating Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Quote className="h-12 w-12 text-purple-400" />
              </div>

              <CardContent className="p-8 relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                    />
                  ))}
                  <span className="ml-3 text-yellow-400 font-bold text-lg">{testimonial.rating}.0</span>
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-gray-300 mb-6 leading-relaxed italic text-lg">
                  "{testimonial.content}"
                </blockquote>

                {/* Project & Impact Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Project:</span>
                    <span className="text-cyan-400 font-semibold">{testimonial.project}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Impact:</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-semibold">{testimonial.impact}</span>
                    </div>
                  </div>
                </div>

                {/* Client Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${testimonial.color} rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500`}
                    ></div>
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="relative w-15 h-15 rounded-full border-2 border-white/20"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-purple-400 font-medium">{testimonial.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Metrics */}
        <div className="mt-20">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-400 mb-2">$5M+</div>
              <div className="text-gray-300">Revenue Generated</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <Users className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-cyan-400 mb-2">100K+</div>
              <div className="text-gray-300">Users Impacted</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50">
              <Building className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-gray-300">Companies Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
