import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck2, Compass, LayoutDashboard, Sparkles, Users } from "lucide-react";
import { Link } from "react-router";
import { Aurora } from "@/components/Aurora";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Compass,
    title: "Compatibility-first matching",
    body: "Every classmate is scored across courses, study style, availability, and pace — so you see your best matches first.",
  },
  {
    icon: CalendarCheck2,
    title: "Availability at a glance",
    body: "Compare open hours before you commit. Evening person? Find another evening person in seconds.",
  },
  {
    icon: Users,
    title: "Cohort-aware profiles",
    body: "Filter by cohort, degree, and the subjects that actually overlap with your schedule.",
  },
] as const;

const stats = [
  { value: "1,240+", label: "students matched" },
  { value: "3,580", label: "study sessions booked" },
  { value: "94%", label: "report better grades" },
] as const;

export default function Landing() {
  const authed =
    typeof window !== "undefined" &&
    sessionStorage.getItem("studybuddy-auth") === "1";

  return (
    <div className="relative flex min-h-screen flex-col">
      <Aurora />

      {/* Nav */}
      <header className="container pt-6">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass glass-soft flex items-center justify-between rounded-2xl px-4 py-3"
        >
          <Link to="/" className="flex items-center gap-3">
            <BrandMark size={36} />
            <span className="tracking-tight font-bold text-lg text-card-foreground">
              Study Buddy
            </span>
          </Link>
          {authed ? (
            <Button
              asChild
              className="cursor-pointer rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 text-white"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="cursor-pointer rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 text-white"
            >
              <Link to="/auth">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </motion.nav>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container pt-16 pb-10 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 flex justify-center"
            >
              <Badge className="glass rounded-full border-primary/40 bg-transparent px-4 py-1.5 text-primary">
                <Sparkles className="size-3.5" />
                Now matching HITSZ cohorts
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="text-4xl leading-tight font-bold tracking-tight text-balance text-card-foreground sm:text-6xl"
            >
              Find the study partner who{" "}
              <span className="bg-gradient-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent">
                actually gets you
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="mx-auto mt-6 max-w-xl text-lg text-pretty text-glass-muted"
            >
              Study Buddy scores compatibility across courses, schedule, and
              study style — so the guesswork of finding a study group disappears
              and the studying starts.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="h-12 cursor-pointer rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-7 text-base text-white shadow-xs transition-transform duration-200 hover:scale-[1.03]"
              >
                <Link to="/auth">
                  Find my study buddy
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-hover h-12 cursor-pointer rounded-xl bg-transparent px-7 text-base backdrop-blur-md"
              >
                <Link to="/dashboard">
                  <Compass className="size-4" />
                  Explore matches
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero preview panel */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass glass-deep sheen mx-auto mt-16 max-w-4xl rounded-3xl p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: "Yuki Tanaka", role: "CS • Year 3", score: 94 },
                { name: "Amara Okafor", role: "Data Sci • Year 2", score: 88 },
                { name: "Leo Zhang", role: "EE • Year 4", score: 81 },
              ].map((p) => (
                <div
                  key={p.name}
                  className="glass glass-soft glass-interactive rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/80 to-sky-600/80 font-semibold text-white">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">
                        {p.name}
                      </p>
                      <p className="text-xs text-glass-muted">{p.role}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-glass-muted">Match</span>
                      <span className="font-semibold text-primary">
                        {p.score}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500"
                        style={{ width: `${p.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-glass-muted">
              <Sparkles className="size-3.5 text-primary" />
              Live preview of your cohort's compatibility feed
            </div>
          </motion.div>
        </section>

        {/* Feature grid */}
        <section className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-card-foreground">
              Built around how students actually study
            </h2>
            <p className="mt-3 text-glass-muted">
              Not a directory. A matching engine tuned to courses, calendars,
              and the way you like to work.
            </p>
          </motion.div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="glass glass-interactive rounded-2xl p-6"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/25 to-sky-600/25 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-card-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-glass-muted">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats band */}
        <section className="container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="glass mx-auto max-w-4xl rounded-3xl px-8 py-8"
          >
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold tracking-tight text-primary">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-glass-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="container pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="glass glass-deep sheen relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-8 py-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-card-foreground">
              Your next great study group is one code away
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-glass-muted">
              Access is by cohort code. HITSZ students can jump straight in.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 cursor-pointer rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-8 text-base text-white shadow-xs transition-transform duration-200 hover:scale-[1.03]"
              >
                <Link to="/auth">
                  Claim your access
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container pb-10">
        <div className="glass glass-soft flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-5 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <BrandMark size={26} />
            <span className="text-sm text-glass-muted">
              Study Buddy — frosted-glass matching for HITSZ cohorts
            </span>
          </div>
          <p className="text-xs text-glass-muted">
            Built for students, by students · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
