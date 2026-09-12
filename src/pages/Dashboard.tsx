import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Compass,
  Filter,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  Moon,
  RefreshCw,
  Search,
  SearchX,
  Sun,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Aurora } from "@/components/Aurora";
import { BrandMark } from "@/components/BrandMark";
import { Confetti } from "@/components/Confetti";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "studybuddy-theme";

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

type Availability = "mornings" | "evenings" | "weekends";

interface Student {
  id: number;
  name: string;
  major: string;
  year: string;
  cohort: "2025" | "2026";
  matchScore: number;
  availability: Availability;
  courses: string[];
  blurb: string;
}

const STUDENTS: Student[] = [
  {
    id: 1,
    name: "Yuki Tanaka",
    major: "Computer Science",
    year: "Year 3",
    cohort: "2025",
    matchScore: 94,
    availability: "evenings",
    courses: ["Algorithms", "Machine Learning"],
    blurb: "Whiteboard-everything kind of learner. Loves grinding LeetCode together.",
  },
  {
    id: 2,
    name: "Amara Okafor",
    major: "Data Science",
    year: "Year 2",
    cohort: "2026",
    matchScore: 88,
    availability: "mornings",
    courses: ["Statistics", "Machine Learning"],
    blurb: "Early riser, flashcard believer. Will quiz you until it sticks.",
  },
  {
    id: 3,
    name: "Leo Zhang",
    major: "Electrical Engineering",
    year: "Year 4",
    cohort: "2025",
    matchScore: 81,
    availability: "weekends",
    courses: ["Signals & Systems", "Circuit Design"],
    blurb: "Weekend lab warrior. Brings snacks, patience, and an oscilloscope.",
  },
  {
    id: 4,
    name: "Priya Sharma",
    major: "Mathematics",
    year: "Year 3",
    cohort: "2026",
    matchScore: 77,
    availability: "evenings",
    courses: ["Linear Algebra", "Real Analysis"],
    blurb: "Explains proofs three ways until one clicks. Tea-fueled study marathons.",
  },
  {
    id: 5,
    name: "Daniel Kim",
    major: "Computer Engineering",
    year: "Year 2",
    cohort: "2025",
    matchScore: 72,
    availability: "mornings",
    courses: ["Operating Systems", "Digital Logic"],
    blurb: "Pomodoro purist. 25 minutes deep work, 5 minutes memes.",
  },
  {
    id: 6,
    name: "Sofia Rossi",
    major: "Physics",
    year: "Year 4",
    cohort: "2026",
    matchScore: 68,
    availability: "weekends",
    courses: ["Quantum Mechanics", "Thermodynamics"],
    blurb: "Study-café regular with a highlighter collection. Explains with doodles.",
  },
];

const FILTERS: { value: Availability | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "mornings", label: "Mornings" },
  { value: "evenings", label: "Evenings" },
  { value: "weekends", label: "Weekends" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function scoreTone(score: number) {
  if (score >= 85) return "text-[var(--tone-high)]";
  if (score >= 70) return "text-[var(--tone-mid)]";
  return "text-[var(--tone-low)]";
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="glass glass-soft glass-interactive rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8a3582]/15 to-[#bf9245]/25 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-2xl font-bold tracking-tight text-card-foreground">
            {value}
          </p>
          <p className="truncate text-xs text-glass-muted">
            {label}
            {hint ? ` · ${hint}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function StudentCard({
  student,
  onConnect,
}: {
  student: Student;
  onConnect: (s: Student) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass glass-interactive group flex flex-col rounded-3xl p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a3582]/90 to-[#bf9245]/90 text-lg font-semibold text-white">
            {initials(student.name)}
          </div>
          <div>
            <p className="font-semibold tracking-tight text-card-foreground">
              {student.name}
            </p>
            <p className="text-xs text-glass-muted">
              {student.major} · {student.year}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="border-primary/40 bg-transparent text-xs text-primary"
        >
          Class of {student.cohort}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-glass-muted">
        {student.blurb}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {student.courses.map((c) => (
          <span
            key={c}
            className="glass glass-soft rounded-full px-2.5 py-1 text-xs text-glass-muted"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-glass-muted">
            <Compass className="size-3.5" /> Match score
          </span>
          <span className={cn("font-semibold", scoreTone(student.matchScore))}>
            {student.matchScore}%
          </span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
          role="progressbar"
          aria-valuenow={student.matchScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${student.name} match score`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${student.matchScore}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="h-full rounded-full bg-gradient-to-r from-[#c084fc] to-[#e0b356]"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/10">
        <span className="flex items-center gap-1.5 text-xs text-glass-muted capitalize">
          {student.availability === "mornings" ? (
            <Sun className="size-3.5" />
          ) : student.availability === "evenings" ? (
            <Moon className="size-3.5" />
          ) : (
            <CalendarDays className="size-3.5" />
          )}
          {student.availability}
        </span>
        <Button
          size="sm"
          onClick={() => onConnect(student)}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white transition-transform duration-200 hover:scale-[1.04]"
        >
          <Handshake className="size-4" />
          Connect
        </Button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { dark, toggle } = useDarkMode();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Availability | "all">("all");
  const [connected, setConnected] = useState<number[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENTS.filter((s) => {
      const matchesFilter = filter === "all" || s.availability === filter;
      const matchesQuery =
        q === "" ||
        s.name.toLowerCase().includes(q) ||
        s.major.toLowerCase().includes(q) ||
        s.courses.some((c) => c.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [query, filter]);

  const handleConnect = (student: Student) => {
    if (connected.includes(student.id)) {
      toast.info(`Already connected with ${student.name.split(" ")[0]}`, {
        description: "Check your session invites — ping them anytime.",
      });
      return;
    }
    setConnected((prev) => [...prev, student.id]);
    setConfettiKey((k) => k + 1);
    toast.success(`Invite sent to ${student.name.split(" ")[0]}! 🎉`, {
      description: `${student.matchScore}% match — they usually reply within a day.`,
    });
  };

  const avgMatch =
    STUDENTS.reduce((sum, s) => sum + s.matchScore, 0) / STUDENTS.length;
  const topMatch = Math.max(...STUDENTS.map((s) => s.matchScore));
  const availabilities = new Set(STUDENTS.map((s) => s.availability));

  return (
    <div className="relative min-h-screen">
      <Aurora />
      <Confetti fireKey={confettiKey} />

      <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:py-10">
        {/* Header */}
        <header className="glass glass-soft flex flex-col gap-4 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark size={38} />
            <span className="tracking-tight font-bold text-lg text-card-foreground">
              Study Buddy
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="glass-hover size-10 cursor-pointer rounded-xl bg-transparent"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button
              onClick={() => {
                setConnected([]);
                setConfettiKey((k) => k + 1);
                toast("Roster reset", {
                  description: "All connections cleared — start fresh.",
                });
              }}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
            >
              <RefreshCw className="size-4" />
              New session
            </Button>
          </div>
        </header>

        {/* Title row */}
        <div className="mt-8 flex flex-col gap-1">
          <p className="flex items-center gap-2 text-sm text-glass-muted">
            <LayoutDashboard className="size-4" /> Cohort matching hub
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
            Your study matches
          </h1>
          <p className="mt-1 text-glass-muted">
            Six hand-picked classmates from your cohort, ranked by
            compatibility.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            label="classmates in roster"
            value={String(STUDENTS.length)}
            hint="6 cohorts sampled"
          />
          <StatCard
            icon={Compass}
            label="average match score"
            value={`${Math.round(avgMatch)}%`}
            hint={`top ${topMatch}%`}
          />
          <StatCard
            icon={Clock}
            label="study windows"
            value={String(availabilities.size)}
            hint="mornings · evenings · weekends"
          />
        </div>

        {/* Search + filter toolbar */}
        <div className="glass glass-soft mt-6 flex flex-col gap-3 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, major, or course…"
              className="glass-hover h-11 rounded-xl bg-transparent pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-glass-muted">
              <Filter className="size-3.5" /> Availability
            </span>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  filter === f.value
                    ? "bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
                    : "glass glass-hover text-glass-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid / empty state */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass glass-deep flex flex-col items-center rounded-3xl px-8 py-16 text-center"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a3582]/15 to-[#bf9245]/25 text-primary">
                <SearchX className="size-8" />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-card-foreground">
                No matches found
              </h2>
              <p className="mt-2 max-w-sm text-sm text-glass-muted">
                {query
                  ? `Nothing matches "${query}"${filter !== "all" ? ` in ${filter}` : ""}. Try a different search or clear the filters.`
                  : "No classmates available in this study window right now."}
              </p>
              <Button
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  toast("Filters cleared", {
                    description: "Showing all six classmates again.",
                  });
                }}
                className="mt-6 cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
              >
                <RefreshCw className="size-4" />
                Clear filters
              </Button>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((s) => (
                  <StudentCard key={s.id} student={s} onConnect={handleConnect} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-3 pb-4 text-xs text-glass-muted sm:flex-row">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="size-3.5" />
            Study Buddy · frosted-glass matching for HITSZ cohorts
          </span>
          <span>
            {connected.length > 0
              ? `${connected.length} connection${connected.length > 1 ? "s" : ""} made this session`
              : "Connect with a classmate to start a session"}
          </span>
        </footer>
      </div>
    </div>
  );
}
