# UNIGAP LMS — Frontend (Core Slice)

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## What's included in this pass

- Design system: color tokens, light/dark mode, Button/Card/Badge/Progress primitives
- Landing page `/` — all 15 sections (hero, categories, popular courses, how it works,
  AI companion, gamification, progress viz, achievements, certificates, testimonials,
  FAQ, final CTA)
- Learner dashboard `/dashboard` — streak, XP, daily goal, continue learning, weekly
  progress, AI companion, achievements, upcoming goals, recent activity
- Course discovery `/courses` — search, category/level filters, sorting
- Course detail `/courses/[slug]` — hero, outcomes, expandable curriculum, requirements,
  reviews, enrollment CTA
- Pricing `/pricing` — Free / Pro Monthly / Pro Annual comparison
- Achievements `/achievements` — unlocked/locked grid with progress
- Lightweight versions of `/certificates`, `/notifications`, `/profile`, `/settings`
  so sidebar navigation has no dead links

Mock data lives in `lib/mock/`, exposed through `lib/services/*.service.ts`.
Components only ever call the service functions — swap the internals for real
NestJS `fetch` calls later and no UI code needs to change.

## Not yet built (next passes)

- `/learning/[courseId]` focused lesson player
- `/assessments` + `/assessments/[id]` quiz flow
- Full certificate preview / detail page
- `/checkout`, `/payment-success`, `/payment-failed` (mock checkout UI)
- `/admin/*` full admin dashboard (users, courses, analytics, payments)
- Auth screens (login/register) — currently all "Log in" / "Start Learning" CTAs
  route straight to `/dashboard`
- Loading skeletons and dedicated error boundaries per route

## Note on verification

This project was generated in a sandboxed environment without internet access,
so `npm install`, `next build`, `next lint`, and `tsc --noEmit` could not be run
here. Please run those locally before shipping — happy to fix anything they turn up.
