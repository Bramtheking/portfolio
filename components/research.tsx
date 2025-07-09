import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Calendar } from "lucide-react"

const publications = [
  {
    title: "Simulating Smell: A Theoretical Approach to Olfactory Perception Using Electromagnetic Waves",
    journal: "Academia",
    year: "2024",
    author: "Bramwel A. G. I. N. A. Oranga",
    description:
      "Develops a theoretical device that simulates smell using terahertz-range electromagnetic waves, bypassing volatile chemicals by directly stimulating olfactory receptors. Builds upon the vibrational theory of olfaction, proposing that receptors detect molecular vibration frequencies via quantum tunneling.",
    link: "#",
    tags: ["Electromagnetic Waves", "Olfactory Perception", "Quantum Tunneling", "VR Technology"],
    significance:
      "Pioneers a novel, non-invasive method to evoke smell, enabling integration into VR, health diagnostics, and consumer electronics.",
  },
  {
    title: "Hybrid Technology Census Solution: A Comprehensive Analysis of Modern Population Enumeration",
    journal: "Academia",
    year: "2025",
    author: "Bramwel Agina",
    description:
      "Proposes a hybrid census model combining administrative data, self-reporting, selective manual enumeration, geospatial methods, and statistical modeling. Aims for 96-98% coverage and up to 90% cost reduction versus traditional approaches.",
    link: "#",
    tags: ["Census Technology", "Data Collection", "Statistical Modeling", "Geospatial Analysis"],
    significance:
      "Represents a scalable, modern alternative for countries grappling with budget constraints and under-enumeration.",
  },
  {
    title: "Emergent Consciousness Through Associative Learning: A Baby-Like Artificial Intelligence System",
    journal: "Academia",
    year: "2025",
    author: "Bramwel Agina",
    description:
      "Investigates if consciousness can emerge from experience-driven, grounded associative learning—emulating a newborn's cognitive development. Introduces the Baby-Like Artificial Intelligence System (BLAIS) that learns through interactive simulation in a 3D environment.",
    link: "#",
    tags: ["Artificial Intelligence", "Consciousness", "Machine Learning", "Cognitive Development"],
    significance:
      "Contributes to the philosophy of mind and AI by exploring how structured experiences might give rise to self-awareness.",
  },
]

export default function Research() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Research & Publications
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4">Contributing to the advancement of technology through research</p>
        </div>

        <div className="space-y-6">
          {publications.map((pub, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors leading-tight">
                        {pub.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{pub.year}</span>
                      </div>
                    </div>

                    <p className="text-cyan-400 font-medium mb-2">By {pub.author}</p>
                    <p className="text-cyan-400 font-medium mb-3">Published on {pub.journal}</p>

                    <p className="text-gray-300 mb-3 leading-relaxed text-sm">{pub.description}</p>

                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-3 mb-4">
                      <p className="text-green-400 text-sm font-medium">Key Significance:</p>
                      <p className="text-gray-300 text-sm">{pub.significance}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black bg-transparent rounded-xl"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Publication
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
