import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Clock,
  MessageCircle,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Answer {
  id: number;
  author: string;
  body: string;
  timeAgo: string;
}

interface Question {
  id: number;
  title: string;
  course: string;
  topic: string;
  asker: string;
  timeAgo: string;
  answers: Answer[];
}

const SEED_QUESTIONS: Question[] = [
  {
    id: 1,
    title: "How do I actually pass Linear Algebra finals?",
    course: "Math 201",
    topic: "Exam strategy",
    asker: "Noah B.",
    timeAgo: "2h ago",
    answers: [
      {
        id: 1,
        author: "Priya Sharma ⭐",
        body: "Do every past paper twice. First untimed, then timed. The exam recycles 70% of its problem types — once you see the patterns, it's mechanical.",
        timeAgo: "1h ago",
      },
      {
        id: 2,
        author: "Daniel Kim ⭐",
        body: "Make a one-page cheat sheet by hand. The act of condensing 12 weeks into one page IS the revision. Then throw it away before the exam.",
        timeAgo: "45m ago",
      },
      {
        id: 3,
        author: "Sofia Rossi ⭐",
        body: "Form a group of 3-4 and take turns explaining proofs out loud. If you can't explain eigenvectors to someone else, you don't know them yet.",
        timeAgo: "20m ago",
      },
    ],
  },
  {
    id: 2,
    title: "Best way to practice SQL before the CS101 practical?",
    course: "CS 101",
    topic: "Study plan",
    asker: "Emma W.",
    timeAgo: "5h ago",
    answers: [
      {
        id: 1,
        author: "Yuki Tanaka ⭐",
        body: "LeetCode has a dedicated SQL 50 list. Do the easy ones for JOINs muscle memory, then the mediums — the practical is basically mediums with a story wrapper.",
        timeAgo: "4h ago",
      },
      {
        id: 2,
        author: "Amara Okafor ⭐",
        body: "Download the sample Chinook database and answer your own questions about it. Real data makes the syntax stick far better than toy tables.",
        timeAgo: "3h ago",
      },
    ],
  },
  {
    id: 3,
    title: "Signals & Systems problem sets take me 6+ hours. Normal?",
    course: "EE 210",
    topic: "Workload",
    asker: "Raj P.",
    timeAgo: "1d ago",
    answers: [
      {
        id: 1,
        author: "Leo Zhang ⭐",
        body: "Normal for week 1-3. It drops to ~3 hours once convolution clicks. Until then: draw the graphs by hand, don't skip straight to formulas.",
        timeAgo: "22h ago",
      },
      {
        id: 2,
        author: "Priya Sharma ⭐",
        body: "6 hours alone is too long. Book a room in the Study Room tab and grind it with someone — my pset time halved after I stopped solo-grinding.",
        timeAgo: "20h ago",
      },
    ],
  },
];

const COURSES = ["CS 101", "CS 201", "Math 201", "EE 210", "Data Sci 150"];
const TIME_FILTERS = ["All", "Last 24h", "This week"] as const;

function hoursOf(timeAgo: string) {
  if (timeAgo.includes("d")) return parseInt(timeAgo) * 24;
  if (timeAgo.includes("h")) return parseInt(timeAgo);
  if (timeAgo.includes("m")) return parseInt(timeAgo) / 60;
  return 0;
}

function QuickAnswer({ onAdd }: { onAdd: (body: string) => void }) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    onAdd(body);
    setDraft("");
    toast.success("Answer added");
  };

  return (
    <div className="flex items-center gap-2 pt-1">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add your answer…"
        className="glass-hover h-10 rounded-xl bg-transparent"
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <Button
        size="icon"
        onClick={submit}
        aria-label="Send answer"
        className="glass-hover size-10 shrink-0 cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}

export default function AskSenior() {
  const [questions, setQuestions] = useState<Question[]>(SEED_QUESTIONS);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [timeFilter, setTimeFilter] =
    useState<(typeof TIME_FILTERS)[number]>("All");
  const [askOpen, setAskOpen] = useState(false);
  const [form, setForm] = useState({ course: "", topic: "", question: "" });

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesCourse = courseFilter === "All" || q.course === courseFilter;
      const hours = hoursOf(q.timeAgo);
      const matchesTime =
        timeFilter === "All" ||
        (timeFilter === "Last 24h" && hours <= 24) ||
        (timeFilter === "This week" && hours <= 168);
      return matchesCourse && matchesTime;
    });
  }, [questions, courseFilter, timeFilter]);

  const addAnswer = (questionId: number, body: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [
                ...q.answers,
                { id: Date.now(), author: "You", body, timeAgo: "just now" },
              ],
            }
          : q,
      ),
    );
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.course || !form.topic.trim() || !form.question.trim()) {
      toast.error("Missing fields", {
        description: "Fill in the course, topic, and your question.",
      });
      return;
    }
    const q: Question = {
      id: Date.now(),
      title: form.question.trim().slice(0, 90),
      course: form.course,
      topic: form.topic.trim(),
      asker: "You",
      timeAgo: "just now",
      answers: [],
    };
    setQuestions((prev) => [q, ...prev]);
    setExpandedId(q.id);
    setAskOpen(false);
    setForm({ course: "", topic: "", question: "" });
    toast.success("Question posted!", {
      description: "Seniors in your cohort will see it in their feed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="glass glass-soft flex flex-col gap-3 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {["All", ...COURSES].map((c) => (
            <button
              key={c}
              onClick={() => setCourseFilter(c)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                courseFilter === c
                  ? "bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
                  : "glass glass-hover text-glass-muted",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TIME_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                timeFilter === t
                  ? "bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
                  : "glass glass-hover text-glass-muted",
              )}
            >
              {t}
            </button>
          ))}
          <Button
            onClick={() => setAskOpen(true)}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white transition-transform duration-200 hover:scale-[1.03]"
          >
            <Sparkles className="size-4" />
            Ask a Question
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass glass-deep rounded-3xl px-8 py-14 text-center">
            <MessageCircle className="mx-auto size-8 text-primary" />
            <h3 className="mt-4 font-semibold text-card-foreground">
              No questions here yet
            </h3>
            <p className="mt-1 text-sm text-glass-muted">
              Try a different filter — or be the first to ask.
            </p>
          </div>
        ) : (
          filtered.map((q) => {
            const open = expandedId === q.id;
            return (
              <motion.div
                layout
                key={q.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="glass glass-interactive rounded-3xl p-5 sm:p-6"
              >
                <button
                  onClick={() => setExpandedId(open ? null : q.id)}
                  className="w-full cursor-pointer text-left"
                  aria-expanded={open}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="glass glass-soft rounded-full px-2.5 py-1 text-xs font-medium text-primary">
                          {q.course}
                        </span>
                        <span className="text-xs text-glass-muted">
                          {q.topic}
                        </span>
                      </div>
                      <h3 className="mt-2.5 text-lg leading-snug font-semibold tracking-tight text-card-foreground">
                        {q.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-glass-muted">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="size-3.5" />
                          {q.answers.length}{" "}
                          {q.answers.length === 1 ? "answer" : "answers"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {q.timeAgo}
                        </span>
                        <span>asked by {q.asker}</span>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-1 size-5 shrink-0 text-glass-muted transition-transform duration-300",
                        open && "rotate-180",
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 space-y-3 border-t border-black/10 pt-5 dark:border-white/10">
                        {q.answers.length === 0 ? (
                          <p className="text-sm text-glass-muted">
                            No answers yet — seniors are on their way. ☕
                          </p>
                        ) : (
                          q.answers.map((a) => (
                            <div
                              key={a.id}
                              className="glass glass-soft rounded-2xl p-4"
                            >
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-card-foreground">
                                  {a.author.replace(" ⭐", "")}
                                </span>
                                {a.author.includes("⭐") && (
                                  <Star className="size-3.5 fill-[#e0b356] text-[#e0b356]" />
                                )}
                              </div>
                              <p className="mt-1.5 text-sm leading-relaxed text-glass-muted">
                                {a.body}
                              </p>
                              <p className="mt-2 text-xs text-glass-muted/70">
                                {a.timeAgo}
                              </p>
                            </div>
                          ))
                        )}

                        <QuickAnswer onAdd={(body) => addAnswer(q.id, body)} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Ask modal */}
      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent className="glass glass-deep max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="tracking-tight text-card-foreground">
              Ask the seniors
            </DialogTitle>
            <DialogDescription className="text-glass-muted">
              Your question goes to verified seniors from your cohort.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAsk} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider uppercase text-glass-muted">
                Course
              </label>
              <Select
                value={form.course}
                onValueChange={(v) => setForm((f) => ({ ...f, course: v }))}
              >
                <SelectTrigger className="glass-hover w-full rounded-xl bg-transparent">
                  <SelectValue placeholder="Pick a course" />
                </SelectTrigger>
                <SelectContent className="glass glass-deep rounded-xl">
                  {COURSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider uppercase text-glass-muted">
                Topic
              </label>
              <Input
                value={form.topic}
                onChange={(e) =>
                  setForm((f) => ({ ...f, topic: e.target.value }))
                }
                placeholder="e.g. Exam strategy"
                className="glass-hover h-11 rounded-xl bg-transparent"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider uppercase text-glass-muted">
                Question
              </label>
              <Textarea
                value={form.question}
                onChange={(e) =>
                  setForm((f) => ({ ...f, question: e.target.value }))
                }
                placeholder="What do you want to know?"
                className="glass-hover min-h-24 rounded-xl bg-transparent"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAskOpen(false)}
                className="glass-hover cursor-pointer rounded-xl bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
              >
                <Send className="size-4" />
                Post question
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
