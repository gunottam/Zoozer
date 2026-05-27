const BASE_URL = "https://api.groq.com/openai/v1"
const MODEL = "llama-3.3-70b-versatile"

function getApiKey(): string {
  return import.meta.env.VITE_GROQ_API_KEY || ""
}

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

async function chat(messages: ChatMessage[]): Promise<string> {
  const key = getApiKey()
  if (!key) throw new Error("VITE_GROQ_API_KEY not set")

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 512,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.choices[0]?.message?.content || ""
}

export async function suggestTopic(
  problemName: string,
  existingTopics: string[],
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `You are a DSA topic classifier. Given a competitive programming problem name, suggest the single most relevant topic. Choose from the existing topics if one fits, otherwise suggest a new concise topic name. Reply with ONLY the topic name, nothing else.`,
    },
    {
      role: "user",
      content: `Problem: "${problemName}"\nExisting topics: ${existingTopics.join(", ")}\n\nWhat topic does this problem belong to?`,
    },
  ]

  const response = await chat(messages)
  return response.trim()
}

export interface WeaknessResult {
  rankings: { topic: string; score: number; reason: string }[]
  summary: string
}

export async function analyzeWeaknesses(
  topicData: { name: string; weaknessScore: number; total: number; hardCount: number; upsolveCount: number }[],
): Promise<WeaknessResult> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `You analyze a competitive programmer's topic-wise performance data and return a prioritized revision list. You must respond in valid JSON format with this structure:
{"rankings": [{"topic": "string", "score": number, "reason": "brief reason"}], "summary": "1-2 sentence overall assessment"}
Order by weakness (highest score first). Only include topics with score > 30.`,
    },
    {
      role: "user",
      content: `Here's my topic performance data:\n${JSON.stringify(topicData, null, 2)}\n\nAnalyze my weak areas and give me a prioritized revision list.`,
    },
  ]

  const response = await chat(messages)

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim()
    return JSON.parse(cleaned)
  } catch {
    return {
      rankings: topicData
        .filter((t) => t.weaknessScore > 30)
        .sort((a, b) => b.weaknessScore - a.weaknessScore)
        .map((t) => ({ topic: t.name, score: t.weaknessScore, reason: "High difficulty ratio" })),
      summary: "Analysis based on your performance metrics.",
    }
  }
}
