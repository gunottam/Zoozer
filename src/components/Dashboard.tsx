import { AlertTriangleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { TopicStats } from "@/lib/types"

interface DashboardProps {
  totalProblems: number
  topicCount: number
  streak: number
  weakTopics: TopicStats[]
  reminders: TopicStats[]
}

export function Dashboard({
  totalProblems,
  topicCount,
  streak,
  weakTopics,
  reminders,
}: DashboardProps) {
  return (
    <div className="flex flex-col gap-8">
      {reminders.length > 0 && (
        <div className="flex flex-col gap-2">
          {reminders.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-3 rounded border-l-2 border-clay bg-clay/5 px-4 py-3"
            >
              <AlertTriangleIcon className="size-4 shrink-0 text-clay" />
              <span className="text-sm">
                <span className="font-heading italic text-stone-muted">
                  Memorandum:
                </span>{" "}
                Topic <strong className="text-clay">{r.name}</strong> untouched for
                7+ days &mdash; revision is due.
              </span>
            </div>
          ))}
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <span className="label-caps">I. The Ledger</span>
          <span className="label-caps">Today</span>
        </div>

        <div className="paper-card grid grid-cols-1 divide-stone-tan sm:grid-cols-3 sm:divide-x">
          <div className="flex flex-col gap-3 p-6 sm:p-8">
            <span className="label-caps">Solved</span>
            <span className="stat-numeral text-7xl">
              {totalProblems.toString().padStart(2, "0")}
            </span>
            <span className="font-heading text-xs italic text-stone-muted">
              problems committed to memory
            </span>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-tan p-6 sm:border-t-0 sm:p-8">
            <span className="label-caps">Topics</span>
            <span className="stat-numeral text-7xl">
              {topicCount.toString().padStart(2, "0")}
            </span>
            <span className="font-heading text-xs italic text-stone-muted">
              domains of inquiry explored
            </span>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-tan p-6 sm:border-t-0 sm:p-8">
            <span className="label-caps">Streak</span>
            <span className="stat-numeral text-7xl">
              {streak.toString().padStart(2, "0")}
            </span>
            <span className="font-heading text-xs italic text-stone-muted">
              {streak === 1 ? "consecutive day" : "consecutive days"} of practice
            </span>
          </div>
        </div>
      </section>

      {weakTopics.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <span className="label-caps">II. Areas of Concern</span>
            <span className="label-caps">{weakTopics.length} flagged</span>
          </div>

          <div className="paper-card p-6">
            <p className="mb-4 font-heading italic text-stone-muted">
              The following topics warrant deliberate revision:
            </p>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((t) => (
                <Badge
                  key={t.name}
                  variant="secondary"
                  className="gap-2 rounded-sm border border-stone-tan bg-stone-cream px-3 py-1 text-stone-ink"
                >
                  <span className="font-heading italic">{t.name}</span>
                  <span className="font-mono text-xs text-clay">
                    {t.weaknessScore}%
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {totalProblems === 0 && (
        <section className="paper-card corner-decor flex flex-col items-center gap-4 p-12 text-center">
          <p className="font-heading text-2xl italic text-stone-muted">
            &ldquo;A blank page awaits.&rdquo;
          </p>
          <p className="max-w-sm text-sm text-stone-muted">
            Begin your record by logging the first problem. Each entry compounds
            into mastery.
          </p>
        </section>
      )}
    </div>
  )
}
