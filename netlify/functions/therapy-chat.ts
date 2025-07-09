import type { Handler } from "@netlify/functions"

const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  }

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    }
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    const { message, history = [], isProjectAssistant = true } = JSON.parse(event.body || "{}")

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Message is required" }),
      }
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API key not configured" }),
      }
    }

    // Enhanced system prompt for project assistant
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
- GitHub: https://github.com/Bramtheking/SCHACCS.git
- Download: https://drive.google.com/file/d/1oNvRwnLwDcZJQZFzQKMfCSbODjAQ2hwW/view?usp=drivesdk

2. PEFRANK SACCO BANKING APPLICATION
- Technology: Java, Android SDK, SQLite, Material Design
- Features: Savings management, loan applications, financial reports, member portal, transaction history
- Impact: Digitized SACCO operations, improved member financial services
- Note: Company policy restricts public access

3. ALLOTMEAL BUSINESS NETWORKING PLATFORM
- Technology: Next.js, React, Tailwind CSS, TypeScript
- Features: Business directory, hotel listings, restaurant network, partnership matching, growth analytics
- Impact: Connected 100+ businesses across Africa for networking opportunities
- Live: https://allotmealafroc.netlify.app

4. AI HUMAN TEXT DETECTOR
- Technology: Python, BERT model, Machine Learning, Natural Language Processing
- Features: Real-time AI text detection, accuracy scoring, batch processing, API integration
- Achievement: 99.2% accuracy in detecting AI-generated content
- GitHub: https://github.com/Bramtheking/aidetectorandroidapp.git

5. LOAN DEFAULT PREDICTION MODEL
- Technology: Python, Scikit-learn, Pandas, NumPy, Machine Learning
- Features: Predictive modeling, risk assessment, data analysis, performance optimization
- Achievement: Ranked TOP 100 out of 10,000 participants in ML competition
- Impact: 94% prediction accuracy for financial risk assessment
- Kaggle: https://www.kaggle.com/code/bramwelagina/bramwel

6. HEALTH LIVING APP
- Technology: Flutter, AI/ML integration, Firebase, Health APIs
- Features: AI disease detection, health monitoring, personalized recommendations, symptom tracking
- Impact: Provided early health detection for 500+ users
- Download: https://drive.google.com/file/d/1CzDfpguiAVTYj9Bkzfb3K7LrXs8beBal/view?usp=drive_link

7. DOCTOR APP - TELEMEDICINE PLATFORM
- Technology: Flutter, Dart, Firebase, WebRTC, UI/UX Design
- Features: Video consultations, appointment scheduling, secure patient records, prescription management
- GitHub: https://github.com/Bramtheking/healthtracker.git
- Download: https://drive.google.com/file/d/1Jy7pQK5yQCbGM8riHJnGj5QqamAN3w69/view?usp=drive_link

8. AI DETECTOR WEBSITE
- Technology: React.js, Python Flask, TensorFlow, AWS
- Features: Web-based AI detection platform with drag-and-drop interface, batch processing
- GitHub: https://github.com/Bramtheking/Ai-detector-Website-React.git

RESEARCH PUBLICATIONS:
1. "Simulating Smell: A Theoretical Approach to Olfactory Perception Using Electromagnetic Waves" (2024)
   - Academia: https://www.academia.edu/124266169/Simulating_Smell_A_Theoretical_Approach_to_Olfactory_Perception_Using_Electromagnetic_Waves

2. "Hybrid Technology Census Solution: A Comprehensive Analysis of Modern Population Enumeration" (2025)
   - Academia: https://www.academia.edu/130053956/Hybrid_Technology_Census_Solution_A_Comprehensive_Analysis_of_Modern_Population_Enumeration

3. "Emergent Consciousness Through Associative Learning: A Baby-Like Artificial Intelligence System" (2025)
   - Academia: https://www.academia.edu/130053873/Emergent_Consciousness_Through_Associative_Learning_A_Baby_Like_Artificial

DESIGN PROJECTS:
- Coffee Shop Mobile App: https://www.figma.com/design/4kU2NKfmL5YWEijEiJO70W/Coffee-Shop-Mobile-App-Design?node-id=0-1&t=tb9DhqQWHkOy4Tpz-1
- Online Bike Shopping App: https://www.figma.com/design/qhz2JiiViREHisOBP5KOYf/Online-Bike-Shopping-App?node-id=0-1&t=7z44NMIfrW6S8Aih-1

TECHNICAL SKILLS:
- Frontend: Flutter, React, Next.js, HTML5, CSS3, JavaScript, TypeScript, Tailwind CSS
- Backend: Python, Java, Node.js, Firebase, REST APIs, GraphQL
- AI/ML: BERT, Scikit-learn, TensorFlow, Advanced AI models, Natural Language Processing
- Databases: Firebase Firestore, SQLite, MongoDB, PostgreSQL
- Tools: Git, Docker, VS Code, Android Studio, Figma
- Cloud: Firebase, Vercel, Google Cloud Platform

CONTACT INFORMATION:
- Email: bramwela8@gmail.com
- Phone: +254 741 797 609
- Location: Thika, Kenya
- Available for remote work worldwide

INSTRUCTIONS:
- Answer ANY question about Bramwel's work, projects, skills, or experience
- Be enthusiastic and professional
- Provide specific details about projects when asked
- Include relevant links when discussing projects
- Highlight achievements and impact
- Keep responses concise but informative (2-3 sentences max for better user experience)

Remember: You can answer ANYTHING - not just project-related questions. Be helpful, knowledgeable, and showcase Bramwel's expertise!`

    const systemPrompt = isProjectAssistant ? projectSystemPrompt : `You are a helpful AI assistant.`

    // Build conversation context
    const conversationContext = history
      .slice(-6)
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    const fullPrompt = `${systemPrompt}\n\nConversation Context:\n${conversationContext}\n\nUser: ${message}\n\nAssistant:`

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response."

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        timestamp: new Date().toISOString(),
      }),
    }
  } catch (error) {
    console.error("Function error:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      }),
    }
  }
}

export { handler }
