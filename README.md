# 🎓 Study Buddy

**Frosted-glass study-partner matching for HITSZ cohorts** — enter an access code, browse six classmates ranked by compatibility, and connect with your perfect study group.

🌐 **Live demo:** [paste your URL]

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 🔐 **Access-code login** | Cohort-gated entry at `/auth` — correct code is `HITSZ2025`; wrong codes get an inline error + toast |
| 🎴 **Student cards** | Six glass cards with name, major, year, cohort badge, courses, blurb, and initials avatar |
| 📊 **Match score bars** | Animated gradient bars per card, color-coded by compatibility strength |
| 🔎 **Live search** | Instantly filter cards by name, major, or course |
| 🗓 **Availability filter** | Pill filters: All / Mornings / Evenings / Weekends |
| 🌙 **Dark mode** | Header toggle, persisted to `localStorage`, defaults to system preference |
| 📈 **Stats bar** | Roster size, average match score, and study windows at a glance |
| 🫙 **Empty state** | Friendly glass panel with a one-click "clear filters" reset |
| 🔔 **Toasts** | Success / info / error notifications via Sonner |
| 🎉 **Confetti** | Particle burst every time you connect with a classmate |
| 🪟 **Glassmorphism design** | Every surface is frosted glass floating over an animated aurora |

## 🛠 Tech stack

- **React 19** — UI
- **TypeScript** — type safety
- **Vite** — dev server & bundler
- **Tailwind CSS v4** — utility styling with OKLCH theme tokens
- **shadcn/ui** — accessible primitives (Button, Input, Badge)
- **Framer Motion** — entrance animations, layout transitions, bar sweeps
- **Sonner** — toasts · **lucide-react** — icons

## 🎨 Design decisions

**Glassmorphism everywhere, not as an accent.** The whole UI is built from three reusable glass tiers (`glass`, `glass-soft`, `glass-deep`) that combine translucent fills, `backdrop-filter: blur(20–26px) saturate(160%+)`, 1px light borders, an inner top highlight, and deep soft shadows — so navbars, cards, toolbars, and modals all read as the same material at different depths.

**Plum + champagne gold palette.**
- Deep **plum** (`oklch ~0.5 0.13 320` light / `~0.21 0.045 315` dark) provides the cool, dark base that makes gold *glow*.
- **Champagne gold** (`#bf9245` bronze-gold, `#e0b356` champagne) is reserved for primary actions, match bars, and aurora glows — one accent family, used consistently.
- Both modes are first-class: token pairs flip in `.dark`, so glass highlights, score tones (`--tone-high/mid/low`), and confetti stay readable in light *and* dark without hardcoded colors.
- The background is a **breathing aurora** — four radial plum/gold glows plus a dotted texture — which is what makes the translucency visible; glass needs something colorful behind it.

**Supporting choices:** generous 2xl/3xl radii, cards that lift on hover (`glass-interactive`), a light-sheen sweep on hero panels, and tight-tracking bold headings against muted glass text for hierarchy.

## 🚀 Setup

```bash
# 1. Install dependencies
bun install

# 2. Start the dev server
bun run dev

# 3. Open the app and sign in
#    Access code: HITSZ2025
```

Production build: `bun run build` · Preview the build: `bun run preview`

No environment variables or backend setup are required — the app is fully client-side.

## 📁 Folder structure

```
├── index.html                  # Vite entry (title, favicon, manifest)
├── README.md
└── src/
    ├── main.tsx                # Router: / → Landing, /auth, /dashboard (guarded)
    ├── index.css               # Glass tokens, aurora, OKLCH palette (light + dark)
    ├── components/
    │   ├── Aurora.tsx          # Animated aurora + dotted-grid backdrop
    │   ├── BrandMark.tsx       # Glass logo mark
    │   ├── Confetti.tsx        # Celebration particle burst
    │   ├── AccessGuard.tsx     # Session-storage route guard (redirects to /auth)
    │   └── ui/                 # shadcn/ui primitives
    └── pages/
        ├── Landing.tsx         # Hero, feature cards, stats band, CTA, footer
        ├── Auth.tsx            # Access-code gate (HITSZ2025)
        └── Dashboard.tsx       # Matching hub: stats, search, filters, 6 cards
```

## 🔮 Future improvements

- **Real persistence** — move the session flag to Convex auth and store connections/invites in the database
- **Smarter matching** — compute scores from shared courses, schedule overlap, and study-style quizzes instead of static values
- **Profiles & editing** — let students edit their own card, courses, and availability
- **In-app chat / invites** — accept, decline, and schedule sessions from the dashboard
- **Accessibility pass** — full keyboard navigation audit, reduced-motion support for confetti and aurora
- **Tests** — component tests for filtering/search and an E2E happy path (login → connect)
- **More cohorts** — multiple access codes and cohort-scoped rosters

## 👥 Team

- [your name]
- [partner name]
