import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/hooks/useStore"
import { Dashboard } from "@/components/Dashboard"
import { AddProblem } from "@/components/AddProblem"
import { TopicView } from "@/components/TopicView"
import { WeaknessAnalysis } from "@/components/WeaknessAnalysis"

export default function App() {
  const {
    state,
    addProblem,
    deleteProblem,
    addTopic,
    getTopicStats,
    getStreak,
    getRevisionReminders,
  } = useStore()

  const stats = getTopicStats()
  const streak = getStreak()
  const reminders = getRevisionReminders()
  const weakTopics = stats.filter((s) => s.weaknessScore > 50 && s.total > 0)
  const topicsWithProblems = stats.filter((s) => s.total > 0).length

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="grain min-h-svh bg-background text-foreground">
      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:px-10 sm:py-16">
        <header className="mb-10">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label-caps">Vol. 01</span>
            <span className="label-caps hidden sm:block">{today}</span>
            <span className="label-caps">№ {state.problems.length.toString().padStart(3, "0")}</span>
          </div>
          <div className="double-rule" />

          <div className="my-6 flex flex-col items-center gap-3 text-center">
            <img
              src="/zozzer-logo.png"
              alt="zozzer"
              className="h-14 w-auto opacity-90 mix-blend-multiply sm:h-16"
            />
            <h1 className="font-heading text-7xl font-black italic leading-none tracking-tighter text-foreground sm:text-8xl">
              zozzer
            </h1>
            <p className="label-caps">A Notebook of Algorithms &amp; Data Structures</p>
          </div>

          <div className="double-rule" />

          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-heading text-lg italic text-stone-muted">
              &mdash; The disciplined log of a competitive mind
            </p>
            <AddProblem topics={state.topics} onAdd={addProblem} onAddTopic={addTopic} />
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="flex flex-col gap-8">
          <div className="flex justify-center">
            <TabsList className="pill-tabs h-auto">
              <TabsTrigger value="dashboard" className="pill-tab px-5 py-1.5 text-sm">
                Ledger
              </TabsTrigger>
              <TabsTrigger value="topics" className="pill-tab px-5 py-1.5 text-sm">
                Index
              </TabsTrigger>
              <TabsTrigger value="analysis" className="pill-tab px-5 py-1.5 text-sm">
                Insights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <Dashboard
              totalProblems={state.problems.length}
              topicCount={topicsWithProblems}
              streak={streak}
              weakTopics={weakTopics}
              reminders={reminders}
            />
          </TabsContent>

          <TabsContent value="topics">
            <TopicView
              stats={stats}
              problems={state.problems}
              onDelete={deleteProblem}
            />
          </TabsContent>

          <TabsContent value="analysis">
            <WeaknessAnalysis stats={stats} />
          </TabsContent>
        </Tabs>

        <footer className="mt-16 flex items-center justify-between">
          <div className="ornament-rule flex-1" />
          <span className="px-4 font-heading italic text-stone-faded">❦</span>
          <div className="ornament-rule flex-1" />
        </footer>
      </div>
    </div>
  )
}
