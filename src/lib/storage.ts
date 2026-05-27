import type { AppState } from "./types"

const STORAGE_KEY = "zozzer-data"

const DEFAULT_STATE: AppState = {
  problems: [],
  topics: [
    "Arrays",
    "Strings",
    "Linked Lists",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Greedy",
    "Binary Search",
    "Stack",
    "Queue",
    "Heap",
    "Hashing",
    "Recursion",
    "Backtracking",
    "Sorting",
    "Math",
    "Bit Manipulation",
    "Two Pointers",
    "Sliding Window",
    "Trie",
  ],
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as AppState
    return {
      problems: parsed.problems || [],
      topics: parsed.topics || DEFAULT_STATE.topics,
    }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
