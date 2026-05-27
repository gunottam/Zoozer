import { useState } from "react"
import { LoaderIcon, FeatherIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { analyzeWeaknesses, type WeaknessResult } from "@/lib/ai"
import type { TopicStats } from "@/lib/types"

interface WeaknessAnalysisProps {
  stats: TopicStats[]
}

export function WeaknessAnalysis({ stats }: WeaknessAnalysisProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WeaknessResult | null>(null)
  const [error, setError] = useState("")

  async function handleAnalyze() {
    const data = stats
      .filter((s) => s.total > 0)
      .map((s) => ({
        name: s.name,
        weaknessScore: s.weaknessScore,
        total: s.total,
        hardCount: s.hardUnderstanding,
        upsolveCount: s.upsolveCount,
      }))

    if (data.length === 0) {
      setError("Log some problems first to consult the oracle.")
      return
    }

    setLoading(true)
    setError("")
    try {
      const res = await analyzeWeaknesses(data)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="label-caps">III. Insights</span>
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="clay-button h-9 gap-2 rounded-sm border font-heading text-sm italic"
        >
          {loading ? (
            <LoaderIcon className="animate-spin" data-icon="inline-start" />
          ) : (
            <FeatherIcon data-icon="inline-start" />
          )}
          {loading ? "consulting..." : "consult the oracle"}
        </Button>
      </div>

      {error && (
        <div className="paper-card border-l-2 border-clay px-4 py-3 text-sm text-clay">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full bg-stone-tan/40" />
          <Skeleton className="h-20 w-full bg-stone-tan/40" />
          <Skeleton className="h-20 w-full bg-stone-tan/40" />
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col gap-5">
          <article className="paper-card corner-decor px-8 py-6">
            <span className="label-caps">Synopsis</span>
            <p className="mt-3 font-heading text-lg italic leading-relaxed text-stone-ink">
              &ldquo;{result.summary}&rdquo;
            </p>
          </article>

          {result.rankings.length > 0 && (
            <div>
              <span className="label-caps">Recommended Order of Revision</span>
              <div className="mt-3 flex flex-col gap-3">
                {result.rankings.map((r, i) => (
                  <article
                    key={r.topic}
                    className="paper-card flex items-start gap-5 p-5"
                  >
                    <span className="stat-numeral text-4xl">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-heading text-xl font-bold leading-tight">
                          {r.topic}
                        </h3>
                        <Badge className="shrink-0 rounded-sm border border-clay/40 bg-clay/10 font-mono text-xs text-clay">
                          {r.score}%
                        </Badge>
                      </div>
                      <p className="font-heading text-sm italic text-stone-muted">
                        {r.reason}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {result.rankings.length === 0 && (
            <p className="py-4 text-center font-heading italic text-stone-muted">
              No significant weak areas detected. Carry on.
            </p>
          )}
        </div>
      )}

      {!result && !loading && !error && (
        <div className="paper-card corner-decor flex flex-col items-center gap-5 px-6 py-16 text-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-clay/15 blur-xl pulse-icon" />
            <FeatherIcon className="pulse-icon size-10 text-clay" />
          </div>
          <p className="max-w-sm font-heading text-xl italic leading-snug text-stone-ink">
            &ldquo;Know thy weakness, &amp; thou shalt know thy path.&rdquo;
          </p>
          <p className="max-w-xs text-sm text-stone-muted">
            Consult the oracle to receive a prioritized order of topics to revise.
          </p>
        </div>
      )}
    </div>
  )
}
