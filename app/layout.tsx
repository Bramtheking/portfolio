import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bramwel Agina - Software Engineer & Developer",
  description:
    "Experienced Software Engineer specializing in mobile apps, web development, and AI/ML solutions. Building innovative digital experiences with modern technologies.",
  keywords: "Software Engineer, Mobile Developer, Web Developer, Flutter, React, Android, AI/ML, Kenya",
  authors: [{ name: "Bramwel Agina" }],
  openGraph: {
    title: "Bramwel Agina - Software Engineer & Developer",
    description: "Experienced Software Engineer specializing in mobile apps, web development, and AI/ML solutions.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
