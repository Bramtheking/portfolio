import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"

const awards = [
  {
    title: "1st Place - 2024 Country Annual App Development Contest",
    organization: "Gretsa University",
    year: "2024",
    description: "Innovative, user-friendly mobile application",
    icon: Trophy,
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "2nd Place - 2023 Country Annual App Development Contest",
    organization: "National Competition",
    year: "2023",
    description: "Innovative, user-friendly mobile application",
    icon: Medal,
    color: "from-gray-300 to-gray-500",
  },
  {
    title: "1st Place - Busia Web Development Contest",
    organization: "Regional Competition",
    year: "2020",
    description: "Outstanding web development project",
    icon: Award,
    color: "from-amber-400 to-yellow-500",
  },
]

export default function Awards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Awards & Achievements
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4">Recognition for excellence in software development</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => {
            const Icon = award.icon
            return (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 group"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex p-4 rounded-full bg-gradient-to-r ${award.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {award.title}
                  </h3>

                  <p className="text-cyan-400 font-medium mb-2">{award.organization}</p>

                  <p className="text-gray-400 text-sm mb-3">{award.description}</p>

                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full">
                    <span className="text-cyan-300 text-sm font-mono">{award.year}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
