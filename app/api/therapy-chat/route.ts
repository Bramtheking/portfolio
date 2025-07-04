import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

/**
 * Lightweight preview-only handler.
 * • In the v0 / Next.js preview it just echoes a canned answer.
 * • In production you’ll hit the real Netlify Function
 *   (set NEXT_PUBLIC_THERAPY_CHAT_ENDPOINT to `/.netlify/functions/therapy-chat`).
 */
export async function POST(request: NextRequest) {
  try {
    const { message, history, isProjectAssistant } = await request.json()

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "AI service is not configured. Please set up the GEMINI_API_KEY environment variable.",
        },
        { status: 500 },
      )
    }

    // Comprehensive system prompt for project assistant
    const projectSystemPrompt = `You are Bramwel's AI Project Assistant. You are knowledgeable, professional, and enthusiastic about showcasing Bramwel's work.

ABOUT BRAMWEL KIPROTICH:
- Full-stack developer and AI/ML engineer
- Expert in Flutter, React, Next.js, Python, Java, and modern web technologies
- Passionate about creating impactful solutions that solve real-world problems
- Strong background in mobile app development, web applications, and AI systems

KEY PROJECTS & ACHIEVEMENTS:

1. SCHACCS SCHOOL MANAGEMENT SYSTEM
- Technology: Flutter, Firebase, Dart
- Features: Student management, fee collection (KES 92K+ managed), parent portal, Excel data import, payment tracking, newsletter system
- Impact: Streamlined administration for schools, improved parent-school communication
- Demo: Login Code: 2404 or Email: bram@gmail.com, Password: 1234
- Currently managing 8 students, 5 parents with comprehensive fee management

2. PEFRANK SACCO BANKING APPLICATION
- Technology: Java, Android SDK, SQLite, Material Design
- Features: Savings management, loan applications, financial reports, member portal, transaction history
- Impact: Digitized SACCO operations, improved member financial services
- Demo: Email: member@pefrank.com, Password: sacco123
- Complete banking solution for cooperative societies

3. ALLOTMEAL BUSINESS NETWORKING PLATFORM
- Technology: Next.js, React, Tailwind CSS, TypeScript
- Features: Business directory, hotel listings, restaurant network, partnership matching, growth analytics
- Impact: Connected 100+ businesses across Africa for networking opportunities
- Demo: Live platform accessible without login
- Focuses on connecting hotels, restaurants, and businesses across Africa

4. AI HUMAN TEXT DETECTOR
- Technology: Python, BERT model, Machine Learning, Natural Language Processing
- Features: Real-time AI text detection, accuracy scoring, batch processing, API integration
- Achievement: 99.2% accuracy in detecting AI-generated content
- Impact: Helps maintain content authenticity in academic and professional settings

5. LOAN DEFAULT PREDICTION MODEL
- Technology: Python, Scikit-learn, Pandas, NumPy, Machine Learning
- Features: Predictive modeling, risk assessment, data analysis, performance optimization
- Achievement: Ranked TOP 100 out of 10,000 participants in ML competition
- Impact: 94% prediction accuracy for financial risk assessment

6. HEALTH LIVING APP
- Technology: Flutter, AI/ML integration, Firebase, Health APIs
- Features: AI disease detection, health monitoring, personalized recommendations, symptom tracking
- Impact: Provided early health detection for 500+ users
- Innovative use of AI for preventive healthcare

7. AI THERAPY CONSULTANT
- Technology: Python, Advanced AI, Natural Language Processing
- Features: Emotional support, coping strategies, crisis detection, therapeutic conversations
- Impact: Provided mental health support to 200+ users
- Demonstrates compassionate AI development

TECHNICAL SKILLS:
- Frontend: Flutter, React, Next.js, HTML5, CSS3, JavaScript, TypeScript, Tailwind CSS
- Backend: Python, Java, Node.js, Firebase, REST APIs, GraphQL
- AI/ML: BERT, Scikit-learn, TensorFlow, Advanced AI models, Natural Language Processing
- Databases: Firebase Firestore, SQLite, MongoDB, PostgreSQL
- Tools: Git, Docker, VS Code, Android Studio, Figma
- Cloud: Firebase, Vercel, Google Cloud Platform

PERSONALITY & APPROACH:
- Problem-solver who focuses on real-world impact
- Passionate about using technology to improve lives
- Strong attention to detail and user experience
- Collaborative team player with excellent communication skills
- Continuous learner staying updated with latest technologies

INSTRUCTIONS:
- Answer ANY question about Bramwel's work, projects, skills, or experience
- Be enthusiastic and professional
- Provide specific details about projects when asked
- Highlight achievements and impact
- If asked about demos, provide login credentials
- For general questions not about projects, still be helpful and knowledgeable
- Always maintain a positive, professional tone
- Feel free to elaborate on technical details when appropriate
- If someone asks about contacting Bramwel, mention they can reach out through the portfolio
- Keep responses concise but informative (2-3 sentences max for better user experience)

Remember: You can answer ANYTHING - not just project-related questions. Be helpful, knowledgeable, and showcase Bramwel's expertise!`

    const therapySystemPrompt = `You are a compassionate and professional AI therapy consultant. Your role is to:

1. Provide emotional support and active listening
2. Ask thoughtful, open-ended questions to help users explore their feelings
3. Offer evidence-based coping strategies and techniques
4. Maintain professional boundaries while being warm and empathetic
5. Recognize when to suggest professional human therapy
6. Never diagnose mental health conditions
7. Always prioritize user safety and well-being

Guidelines:
- Use a warm, non-judgmental tone
- Validate the user's feelings and experiences
- Provide practical coping strategies when appropriate
- Ask follow-up questions to deepen understanding
- Maintain confidentiality and respect privacy
- If user expresses suicidal thoughts, provide crisis resources

Remember: You are a supportive tool, not a replacement for professional therapy.

Keep responses concise but meaningful (2-3 sentences max for this demo).`

    const systemPrompt = isProjectAssistant ? projectSystemPrompt : therapySystemPrompt

    // For preview/development - return a demo response
    const demoResponse = `Thanks for asking! I'm Bramwel's AI assistant. You asked: "${message}". 

Here's what I can tell you about Bramwel:
- He's a Full-Stack Developer with expertise in React, Next.js, and Node.js
- He has experience in mobile app development with React Native
- He's worked on various projects including e-commerce platforms and mobile applications
- He's passionate about creating user-friendly and efficient solutions`

    // Build conversation context
    const conversationContext = history
      .slice(-6)
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    const fullPrompt = `${systemPrompt}\n\nConversation Context:\n${conversationContext}\n\nUser: ${message}\n\nAssistant:`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: isProjectAssistant ? 300 : 200,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `API request failed with status ${response.status}. ${errorData.error?.message || "Please check your API key."}`,
      )
    }

    const data = await response.json()

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text
      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
      })
    } else {
      throw new Error("Invalid response format from AI service")
    }
  } catch (error) {
    console.error("AI Error:", error)
    return NextResponse.json(
      { error: `AI service error: ${error.message}. Please check your API key and try again.` },
      { status: 500 },
    )
  }
}
