# Study Buddy 🎓

A frosted-glass **student study-partner matching app** for HITSZ cohorts — plum and champagne gold glass over a breathing aurora. Enter an access code, browse six hand-picked classmates ranked by compatibility score, and connect with your perfect study group.

## 🚀 Getting started

The app is pre-configured and running — no setup required.

1. Open the app. The landing page explains what Study Buddy does.
2. Click **Get started** (or **Dashboard** → you'll be redirected).
3. Enter the access code when prompted:

   > **Access code: `HITSZ2025`**

4. You're in — the matching dashboard loads with your six classmates.

## ✨ Features

| Feature | Where |
| --- | --- |
| 🔐 Access-code login (`HITSZ2025`) | `/auth` — wrong codes show a toast + inline error |
| 🎴 Six student cards | `/dashboard` — name, major, year, cohort, courses, blurb |
| 📊 Match score bars | Animated gradient bars per card, color-coded by strength |
| 🔎 Search | Filter cards live by name, major, or course |
| 🗓 Availability filter | All / Mornings / Evenings / Weekends pill filters |
| 🌙 Dark mode | Toggle in the dashboard header, persisted to `localStorage` |
| 📈 Stats bar | Roster size, average match score, study windows |
| 🫙 Empty state | Friendly glass panel when search/filter yields nothing |
| 🔔 Toasts | Success / info / error notifications via Sonner |
| 🎉 Confetti | Bursts when you connect with a classmate |
| 🟪🟨 Plum + champagne gold palette | Glass surfaces over an animated aurora backdrop |

## 🎨 Design system — glassmorphism

The whole UI reads as **frosted glass floating over a navy aurora**:

- **Palette** — deep plum base (`oklch` plum scale) with **champagne gold** accents; plum/gold glows breathe in the background aurora.
- **Glass surfaces** — three tiers (`glass`, `glass-soft`, `glass-deep`) combining translucent fills, `backdrop-filter: blur()`, 1px light borders, inner top highlight, and deep soft shadows.
- **Rounded corners** — generous `2xl`/`3xl` radii on every panel and card.
- **Hover effects** — cards lift (`glass-interactive`), controls tint gold (`glass-hover`), and hero panels sweep a light sheen.
- **Typography** — tight-tracking bold headings, muted glass-tinted body text.
- Works in **light and dark** — glass tokens switch automatically.

## 🛠 Tech stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** with OKLCH theme tokens (plum + champagne gold)
- **shadcn/ui** components (Button, Input, Badge, Sonner toasts)
- **Framer Motion** for entrance animations, card transitions, and bar sweeps
- **lucide-react** icons

## 📁 Project structure

```
src/
├── components/
│   ├── Aurora.tsx        # Animated aurora / dotted-grid backdrop
│   ├── BrandMark.tsx     # Glass logo mark
│   ├── Confetti.tsx      # Celebration particle burst
│   └── AccessGuard.tsx   # Route guard (session-storage based)
├── pages/
│   ├── Landing.tsx       # Hero, features, stats, CTA, footer
│   ├── Auth.tsx          # Access-code gate (HITSZ2025)
│   └── Dashboard.tsx     # Matching hub (cards, filters, stats…)
└── index.css             # Glass theme tokens + utilities
```

## 🧭 Routes

| Route | Description |
| --- | --- |
| `/` | Public landing page |
| `/auth` | Access-code login (`HITSZ2025`) |
| `/dashboard` | Protected matching hub — redirects to `/auth?returnTo=/dashboard` when signed out |

---

Built for students, by students · 2026
