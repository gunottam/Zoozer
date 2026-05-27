export interface Problem {
  id: string
  name: string
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  understanding: "Easy" | "Medium" | "Hard"
  upsolve: boolean
  date: string
}

export interface AppState {
  problems: Problem[]
  topics: string[]
}

export interface TopicStats {
  name: string
  total: number
  hardUnderstanding: number
  upsolveCount: number
  weaknessScore: number
  lastAdded: string | null
}
