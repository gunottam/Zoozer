import { useCallback, useEffect, useState } from "react"
import { v4 as uuid } from "uuid"
import type { AppState, Problem, TopicStats } from "@/lib/types"
import { loadState, saveState } from "@/lib/storage"

export function useStore() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const addProblem = useCallback(
    (data: Omit<Problem, "id" | "date">) => {
      const problem: Problem = {
        ...data,
        id: uuid(),
        date: new Date().toISOString(),
      }
      setState((prev) => {
        const topics = prev.topics.includes(data.topic)
          ? prev.topics
          : [...prev.topics, data.topic]
        return { problems: [...prev.problems, problem], topics }
      })
    },
    [],
  )

  const deleteProblem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      problems: prev.problems.filter((p) => p.id !== id),
    }))
  }, [])

  const addTopic = useCallback((topic: string) => {
    setState((prev) => {
      if (prev.topics.includes(topic)) return prev
      return { ...prev, topics: [...prev.topics, topic] }
    })
  }, [])

  const getTopicStats = useCallback((): TopicStats[] => {
    return state.topics.map((name) => {
      const problems = state.problems.filter((p) => p.topic === name)
      const total = problems.length
      const hardUnderstanding = problems.filter((p) => p.understanding === "Hard").length
      const upsolveCount = problems.filter((p) => p.upsolve).length

      let weaknessScore = 0
      if (total > 0) {
        const hardRatio = hardUnderstanding / total
        const upsolveRatio = upsolveCount / total
        weaknessScore = Math.round((hardRatio * 0.6 + upsolveRatio * 0.4) * 100)
      }

      const sorted = [...problems].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      const lastAdded = sorted[0]?.date || null

      return { name, total, hardUnderstanding, upsolveCount, weaknessScore, lastAdded }
    })
  }, [state])

  const getStreak = useCallback((): number => {
    if (state.problems.length === 0) return 0

    const dates = new Set(
      state.problems.map((p) => new Date(p.date).toDateString()),
    )

    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (dates.has(d.toDateString())) {
        streak++
      } else {
        break
      }
    }
    return streak
  }, [state.problems])

  const getRevisionReminders = useCallback((): TopicStats[] => {
    const stats = getTopicStats()
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    return stats.filter(
      (t) =>
        t.weaknessScore > 60 &&
        t.total > 0 &&
        t.lastAdded &&
        new Date(t.lastAdded).getTime() < sevenDaysAgo,
    )
  }, [getTopicStats])

  return {
    state,
    addProblem,
    deleteProblem,
    addTopic,
    getTopicStats,
    getStreak,
    getRevisionReminders,
  }
}
