import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Award } from "lucide-react"

export default function About() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              Passionate Software Engineer with a strong foundation in computer science and hands-on experience building
              innovative solutions. I specialize in creating seamless user experiences across mobile and web platforms,
              with expertise in AI/ML integration and modern development practices.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              My journey spans Android development with Java/Kotlin, cross-platform solutions with Flutter, full-stack
              web development with React.js and Node.js, and intelligent systems powered by TensorFlow and scikit-learn.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {["Android", "Flutter", "React.js", "Node.js", "Python", "AI/ML", "UI/UX"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-8 w-8 text-cyan-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Education</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-cyan-300">BSc in Computer Science</h4>
                    <p className="text-gray-400">Gretsa University • Second Class Upper</p>
                    <p className="text-gray-500 text-sm">2019 - 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Academic Results</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">KCSE:</span>
                    <span className="text-blue-300 font-semibold">B Plain</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">University Degree:</span>
                    <span className="text-blue-300 font-semibold">Second Class Upper</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
