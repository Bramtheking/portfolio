import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import CodeTerminal from "@/components/code-terminal"
import Projects from "@/components/projects"
import Experience from "@/components/experience"
import Awards from "@/components/awards"
import Testimonials from "@/components/testimonials"
import Research from "@/components/research"
import Contact from "@/components/contact"
import InteractiveEndAnimation from "@/components/interactive-end-animation"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/20 text-white overflow-x-hidden">
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="code-terminal">
        <CodeTerminal />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="experience">
        <Experience />
      </div>
      <div id="awards">
        <Awards />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="research">
        <Research />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <div id="interactive-end">
        <InteractiveEndAnimation />
      </div>
    </main>
  )
}
