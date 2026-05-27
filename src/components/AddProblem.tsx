import { useState } from "react"
import { PlusIcon, SparklesIcon, LoaderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { suggestTopic } from "@/lib/ai"
import type { Problem } from "@/lib/types"

interface AddProblemProps {
  topics: string[]
  onAdd: (data: Omit<Problem, "id" | "date">) => void
  onAddTopic: (topic: string) => void
}

export function AddProblem({ topics, onAdd, onAddTopic }: AddProblemProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium")
  const [understanding, setUnderstanding] = useState<"Easy" | "Medium" | "Hard">("Medium")
  const [upsolve, setUpsolve] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestedTopic, setSuggestedTopic] = useState("")
  const [topicFilter, setTopicFilter] = useState("")

  const filteredTopics = topics.filter((t) =>
    t.toLowerCase().includes(topicFilter.toLowerCase()),
  )

  async function handleSuggest() {
    if (!name.trim()) return
    setSuggesting(true)
    try {
      const suggestion = await suggestTopic(name, topics)
      setSuggestedTopic(suggestion)
      setTopic(suggestion)
      setTopicFilter(suggestion)
    } catch {
      setSuggestedTopic("")
    } finally {
      setSuggesting(false)
    }
  }

  function handleSubmit() {
    if (!name.trim() || !topic.trim()) return
    if (!topics.includes(topic)) {
      onAddTopic(topic)
    }
    onAdd({ name: name.trim(), topic, difficulty, understanding, upsolve })
    reset()
    setOpen(false)
  }

  function reset() {
    setName("")
    setTopic("")
    setDifficulty("Medium")
    setUnderstanding("Medium")
    setUpsolve(false)
    setSuggestedTopic("")
    setTopicFilter("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="clay-button h-10 gap-2 rounded-sm border px-5 font-heading text-sm italic">
          <PlusIcon data-icon="inline-start" />
          new entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-stone-tan bg-stone-paper">
        <DialogHeader className="border-b border-stone-tan pb-3">
          <span className="label-caps">New Entry</span>
          <DialogTitle className="font-heading text-3xl font-black italic tracking-tighter text-stone-ink">
            Log a problem
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-2">
          <section className="flex flex-col gap-2">
            <span className="label-caps">Problem Name</span>
            <div className="flex gap-2">
              <Input
                id="problem-name"
                placeholder="e.g. Longest Increasing Subsequence"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  if (name.trim() && !topic) handleSuggest()
                }}
                className="border-stone-tan bg-stone-cream font-heading italic placeholder:text-stone-faded"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleSuggest}
                disabled={!name.trim() || suggesting}
                title="AI Suggest Topic"
                className="border-stone-tan bg-stone-cream text-clay hover:bg-clay/10 hover:text-clay"
              >
                {suggesting ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <SparklesIcon />
                )}
              </Button>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <span className="label-caps">Topic</span>
            {suggestedTopic && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono uppercase tracking-wider text-clay">
                  oracle suggests
                </span>
                <span className="font-heading italic text-stone-ink">
                  {suggestedTopic}
                </span>
              </div>
            )}
            <Input
              placeholder="Search or type a new topic..."
              value={topicFilter}
              onChange={(e) => {
                setTopicFilter(e.target.value)
                setTopic(e.target.value)
              }}
              className="border-stone-tan bg-stone-cream font-heading italic placeholder:text-stone-faded"
            />
            {topicFilter && filteredTopics.length > 0 && (
              <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto rounded border border-stone-tan bg-stone-cream/50 p-2">
                {filteredTopics.slice(0, 10).map((t) => (
                  <Badge
                    key={t}
                    variant={topic === t ? "default" : "outline"}
                    className={
                      topic === t
                        ? "cursor-pointer rounded-sm border-clay bg-clay text-stone-cream"
                        : "cursor-pointer rounded-sm border-stone-tan bg-stone-paper text-stone-muted hover:border-clay hover:text-stone-ink"
                    }
                    onClick={() => {
                      setTopic(t)
                      setTopicFilter(t)
                    }}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <span className="label-caps">Difficulty</span>
            <ToggleGroup
              type="single"
              value={difficulty}
              onValueChange={(v) => v && setDifficulty(v as "Easy" | "Medium" | "Hard")}
              className="w-full"
            >
              <ToggleGroupItem
                value="Easy"
                className="flex-1 rounded-sm border border-stone-tan bg-stone-cream font-heading text-xs italic data-[state=on]:bg-stone-ink data-[state=on]:text-stone-cream"
              >
                Easy
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Medium"
                className="flex-1 rounded-sm border border-stone-tan bg-stone-cream font-heading text-xs italic data-[state=on]:bg-stone-ink data-[state=on]:text-stone-cream"
              >
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Hard"
                className="flex-1 rounded-sm border border-stone-tan bg-stone-cream font-heading text-xs italic data-[state=on]:bg-stone-ink data-[state=on]:text-stone-cream"
              >
                Hard
              </ToggleGroupItem>
            </ToggleGroup>
          </section>

          <section className="flex flex-col gap-2">
            <span className="label-caps">Understanding</span>
            <ToggleGroup
              type="single"
              value={understanding}
              onValueChange={(v) => v && setUnderstanding(v as "Easy" | "Medium" | "Hard")}
              className="w-full"
            >
              <ToggleGroupItem
                value="Easy"
                className="flex-1 rounded-sm border border-stone-tan bg-stone-cream font-heading text-xs italic data-[state=on]:bg-stone-ink data-[state=on]:text-stone-cream"
              >
                Easy
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Medium"
                className="flex-1 rounded-sm border border-stone-tan bg-stone-cream font-heading text-xs italic data-[state=on]:bg-stone-ink data-[state=on]:text-stone-cream"
              >
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Hard"
                className="flex-1 rounded-sm border border-stone-tan bg-stone-cream font-heading text-xs italic data-[state=on]:bg-stone-ink data-[state=on]:text-stone-cream"
              >
                Hard
              </ToggleGroupItem>
            </ToggleGroup>
          </section>

          <section className="flex items-center justify-between rounded border border-stone-tan bg-stone-cream/50 px-4 py-3">
            <div className="flex flex-col">
              <span className="font-heading text-sm italic">Upsolved</span>
              <span className="font-mono text-xs text-stone-muted">
                solved with the editorial&apos;s aid
              </span>
            </div>
            <Switch
              id="upsolve"
              checked={upsolve}
              onCheckedChange={setUpsolve}
              className="data-[state=checked]:bg-clay"
            />
          </section>

          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !topic.trim()}
            className="clay-button h-11 rounded-sm border font-heading text-base italic"
          >
            commit to record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
