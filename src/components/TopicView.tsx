import { useState } from "react"
import { ArrowLeftIcon, TrashIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Problem, TopicStats } from "@/lib/types"

interface TopicViewProps {
  stats: TopicStats[]
  problems: Problem[]
  onDelete: (id: string) => void
}

function weaknessColorClass(score: number): string {
  if (score <= 30) return "text-sage"
  if (score <= 60) return "text-amber"
  return "text-clay"
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-stone-tan/40">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-clay transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function TopicView({ stats, problems, onDelete }: TopicViewProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const activeStats = stats
    .filter((s) => s.total > 0)
    .sort((a, b) => b.weaknessScore - a.weaknessScore)

  if (selected) {
    const topicProblems = problems
      .filter((p) => p.topic === selected)
      .sort((a, b) => {
        const order = { Hard: 0, Medium: 1, Easy: 2 }
        return order[a.understanding] - order[b.understanding]
      })

    const stat = stats.find((s) => s.name === selected)

    return (
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-2 font-heading italic text-stone-muted hover:bg-stone-tan/30 hover:text-stone-ink"
          onClick={() => setSelected(null)}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          back to index
        </Button>

        <div className="flex flex-col gap-3 border-b border-stone-tan pb-6">
          <span className="label-caps">Chapter</span>
          <h2 className="font-heading text-5xl font-black italic tracking-tighter">
            {selected}
          </h2>
          {stat && (
            <div className="flex items-center gap-4 text-sm">
              <span
                className={cn(
                  "font-mono font-medium",
                  weaknessColorClass(stat.weaknessScore),
                )}
              >
                {stat.weaknessScore}% weakness
              </span>
              <span className="text-stone-muted">·</span>
              <span className="font-heading italic text-stone-muted">
                {stat.total} {stat.total === 1 ? "problem" : "problems"}
              </span>
              <span className="text-stone-muted">·</span>
              <span className="font-heading italic text-stone-muted">
                {stat.upsolveCount} upsolved
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {topicProblems.map((p, i) => (
            <article key={p.id} className="paper-card flex items-start gap-4 p-5">
              <span className="stat-numeral pt-1 text-2xl text-stone-faded">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="font-heading text-lg font-bold leading-tight">
                  {p.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-sm border-stone-tan bg-stone-cream font-mono text-xs text-stone-muted">
                    {p.difficulty}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-sm border-stone-tan bg-stone-cream font-mono text-xs",
                      p.understanding === "Hard" && "border-clay/40 bg-clay/10 text-clay",
                    )}
                  >
                    {p.understanding} grasp
                  </Badge>
                  {p.upsolve && (
                    <Badge className="rounded-sm border border-amber/40 bg-amber/15 font-mono text-xs text-amber">
                      Upsolved
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-stone-muted">
                  {formatDate(p.date)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-stone-muted hover:bg-clay/10 hover:text-clay"
                  onClick={() => onDelete(p.id)}
                >
                  <TrashIcon />
                </Button>
              </div>
            </article>
          ))}
          {topicProblems.length === 0 && (
            <p className="py-8 text-center font-heading italic text-stone-muted">
              No entries in this chapter yet.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="label-caps">II. The Index</span>
        {activeStats.length > 0 && (
          <span className="label-caps">{activeStats.length} chapters</span>
        )}
      </div>

      {activeStats.length === 0 && (
        <div className="paper-card corner-decor flex flex-col items-center gap-3 p-12 text-center">
          <p className="font-heading text-2xl italic text-stone-muted">
            &ldquo;The index is empty.&rdquo;
          </p>
          <p className="max-w-xs text-sm text-stone-muted">
            Log your first problem to populate this section.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {activeStats.map((s, i) => (
          <article
            key={s.name}
            className="paper-card-tab cursor-pointer p-5"
            onClick={() => setSelected(s.name)}
          >
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="stat-numeral text-2xl text-stone-faded">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <h3 className="font-heading text-xl font-bold leading-tight">
                  {s.name}
                </h3>
              </div>
              <span className="label-caps shrink-0">
                {s.total} {s.total === 1 ? "entry" : "entries"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-xs italic text-stone-muted">
                  weakness index
                </span>
                <span
                  className={cn(
                    "font-mono text-sm font-medium",
                    weaknessColorClass(s.weaknessScore),
                  )}
                >
                  {s.weaknessScore}%
                </span>
              </div>
              <ProgressBar value={s.weaknessScore} />
            </div>

            <div className="mt-3 flex gap-4 border-t border-stone-tan pt-2 font-mono text-xs text-stone-muted">
              <span>{s.hardUnderstanding} hard</span>
              <span>·</span>
              <span>
                {s.upsolveCount}{" "}
                {s.upsolveCount === 1 ? "upsolve" : "upsolves"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
