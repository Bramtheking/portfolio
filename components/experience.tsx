import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Building } from "lucide-react"

const experiences = [
  {
    title: "Web Developer",
    company: "Allotmeal Afroc",
    period: "Jun 2024 – Present",
    location: "Remote",
    description:
      "Led redesign and development of allotmealafroc.netlify.app to connect hotels, businesses, and stakeholders through listings, networking, and payment services using Next.js, MongoDB, and Netlify.",
    tech: ["Next.js", "MongoDB", "Netlify"],
    current: true,
  },
  {
    title: "Android Developer",
    company: "Schaccs App",
    period: "Jan 2024 – Jun 2024",
    location: "Remote",
    description:
      "Built and maintained a parent-student portal with fee overview, academic results, attendance, and event notifications using Flutter, Firebase, and SQLite.",
    tech: ["Flutter", "Firebase", "SQLite"],
    current: false,
  },
  {
    title: "Android/iOS Developer",
    company: "Pefrank Sacco Ltd",
    period: "Aug 2022 – Aug 2024",
    location: "Kenya",
    description:
      "Developed cross-platform mobile features, integrated RESTful APIs, and optimized UI/UX workflows in Java (Android) and Swift (iOS).",
    tech: ["Java", "Swift", "REST APIs"],
    current: false,
  },
  {
    title: "CRM Web Developer",
    company: "Momentum Credit",
    period: "Jan 2022 – Aug 2024",
    location: "Kenya",
    description:
      "Built secure, responsive CRM modules using PHP, Laravel, and MySQL; collaborated in Agile teams to deliver client requirements on schedule.",
    tech: ["PHP", "Laravel", "MySQL"],
    current: false,
  },
]

export default function Experience() {
  return (
    <section className="py-20 px-4 bg-gray-900/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Professional Experience
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4">Building innovative solutions across diverse industries</p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500 hidden md:block" />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="relative">
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full border-4 border-black hidden md:block" />

                <Card
                  className={`ml-0 md:ml-16 bg-gray-900/50 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 ${exp.current ? "ring-2 ring-cyan-500/30" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{exp.title}</h3>
                        <div className="flex items-center text-cyan-400 mb-2">
                          <Building className="h-4 w-4 mr-2" />
                          <span className="font-medium">{exp.company}</span>
                          {exp.current && (
                            <span className="ml-2 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs">
                              Current
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end text-sm text-gray-400">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
