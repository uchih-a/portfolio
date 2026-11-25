# Portfolio — Alexander Mutsala Nzaywa

Personal portfolio for **Alexander Mutsala Nzaywa** — data engineer who builds software, from pipelines to production APIs. Based in Kenya, open to remote.

## Stack

- Vite + React 18 + TypeScript (strict, no `any`)
- Tailwind CSS 3.4 — dark theme; design tokens live in `tailwind.config.js` and `src/globals.css`
- framer-motion 12, react-router-dom 6, lucide-react
- Urbanist Variable, self-hosted via `@fontsource-variable/urbanist` (no external font/script requests)
- Node 20; deploys to Vercel as a static Vite build plus serverless functions in `/api`

## Scripts

| Command        | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| `npm run dev`  | Local dev server                                        |
| `npm run lint` | ESLint — must pass before every commit                  |
| `npm run build`| Type-check (`tsc -b`) then production build to `dist/`  |
| `npm run preview` | Serve the production build locally (SPA fallback included) |

## Environment variables

Server-side only — never committed, never shipped in client code. See `.env.example` (names only):

| Name             | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `RESEND_API_KEY` | Resend API key used by the contact endpoint  |
| `CONTACT_TO`     | Destination email for contact-form messages |
| `CONTACT_FROM`   | Verified sender address                      |

The destination email lives only in the server environment.

## Media

All media lives in `public/media/`, and **every** path is registered in exactly one map: `src/data/media.ts` (`MEDIA`). To swap a piece of media:

1. Drop the new file into `public/media/`.
2. Keep the same filename, or update the matching key in `src/data/media.ts`.
3. Components resolve media only through that map — nothing references `/media/...` directly.

`/media/landiq-demo.mp4` and `/media/duka-demo.mp4` are referenced but intentionally absent for now: components fall back to their poster images when a video is missing. The current SVG files are dark-gradient placeholders pending real media.

## Structure

```
api/                 serverless functions (Vercel) — health check at /api/health
public/media/        images, posters, (future) videos
src/
  components/
    layout/          Navbar, Footer, Layout, ScrollToTop
    sections/        visual sections (added in later chunks)
    ui/              FadeIn, PrimaryButton, GhostButton, SectionHeading
  data/              ALL site content: site, hero, projects, timeline, services, nav, media
  hooks/             useReducedMotion
  lib/               cn
  pages/             Home, Services, NotFound
```

## Routing & deployment

- Routes: `/` (Home), `/services` (Services), `*` (NotFound).
- Hash targets scroll smoothly: `/#projects`, `/#timeline`, `/#contact`, `/services#duka-manager`, `/services#custom`, `/services#contact`.
- `vercel.json` rewrites everything except `/api/*` to `/index.html` (SPA history fallback), so a refresh on `/services` survives.
- Vercel deploys `main` automatically; `/api` functions run serverless.

## Conventions

- Content is never hard-coded in components — it lives in `src/data/*.ts`.
- `npm run lint` and `npm run build` must pass before every commit; commits follow Conventional Commits.
- Mobile-first (verified 360–1440px, no horizontal scroll, touch targets ≥ 44px), `prefers-reduced-motion` respected, keyboard focus always visible, semantic landmarks throughout.
