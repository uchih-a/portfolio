# Portfolio — Alexander Mutsala Nzaywa

Personal portfolio for **Alexander Mutsala Nzaywa** — data engineer who builds software, from pipelines to production APIs. Based in Kenya, open to remote.

## Features

- **Pages**: cinematic home (hero slideshow, projects, timeline, contact), `/services`, friendly 404. SPA routing with per-route titles, descriptions and canonical URLs.
- **Accessibility**: semantic landmarks (header/nav/main/footer), skip-to-content link, one `h1` per page, visible focus ring everywhere, keyboard-operable dropdown + mobile sheet (Escape closes, focus restores/traps correctly, no traps), `aria-expanded`/`aria-controls` on menu triggers, `aria-live` contact status, ≥ 44px touch targets, body-text contrast ≥ 4.5:1.
- **Reduced motion**: with `prefers-reduced-motion: reduce` there are no wipes, parallax, auto-advance, Ken Burns, pulsing rings or staggered entrances — slides crossfade only when asked, videos show posters, content lands in place.
- **Performance**: route-level code splitting (`React.lazy` + `Suspense`), framer-motion via `LazyMotion`/`domAnimation` (`m.` components), self-hosted Urbanist variable font with a build-injected `<link rel="preload">`, lazy-loaded below-the-fold images, dimensioned media (no layout shift), `width`/`height` or `aspect-ratio` everywhere.
- **SEO**: meta description, `theme-color #0C0C0C`, canonical links, Open Graph + Twitter cards (`og:image` = 1200×630 `/media/og.png` placeholder), SVG monogram favicon, `apple-touch-icon.png`, generated `robots.txt` + `sitemap.xml` (from the site URL constant, below).
- **Contact API**: honeypot + elapsed-time + rate-limit anti-spam, server-side validation, Resend delivery with `reply_to` = sender.

## Stack

- Vite + React 18 + TypeScript (strict, no `any`)
- Tailwind CSS 3.4 — dark theme; design tokens live in `tailwind.config.js` and `src/globals.css`
- framer-motion 12 (`LazyMotion` + `m`), react-router-dom 6, lucide-react
- Urbanist Variable, self-hosted via `@fontsource-variable/urbanist` (no external font/script requests)
- Node 20; deploys to Vercel as a static Vite build plus serverless functions in `/api`

## Scripts

| Command             | Purpose                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Local dev server                                                    |
| `npm run dev:api`   | `vercel dev` — serves the SPA + `/api` functions locally            |
| `npm run lint`      | ESLint — must pass before every commit                              |
| `npm run build`     | Generate raster assets, type-check (`tsc -b`), build to `dist/`     |
| `npm run preview`   | Serve the production build locally (SPA fallback included)          |
| `npm run test:api`  | Curl smoke tests for `/api/contact` (see below)                     |

## Contact form + API

The `<Contact>` section (shared by `/` and `/services`) posts JSON to
`/api/contact`, a Vercel Node function that sends the message through the
Resend REST API (no SDK). Behaviour:

- Only `POST`; anything else gets `405`. Bodies are capped at ~10KB.
- Anti-spam, in order: a filled honeypot field (`company`) returns a silent
  `200 {ok:true}` without sending; submissions with `elapsed < 2500ms`
  since form render get the same silent `200`; an in-memory rate limit
  allows 5 requests per IP per 10 minutes → `429`.
- Server-side validation mirrors the client rules (name 2–80, email format,
  interest from the allowed list, message 10–2000) → `400`.
- User input is escaped in the HTML body and a plain-text part is included.
  Subject: `[Portfolio] {interest} - {name}`; `reply_to` = sender email.
- Missing env vars or a Resend error log server-side (names/status codes
  only) and return `500 {ok:false,error:"Could not send message"}`. The
  destination address and env values are never revealed in any response.

### Testing the API

Run the curl smoke tests (validation, honeypot, elapsed, rate limit) against
a local `vercel dev` — or any deployment, using `BASE=https://…`:

```sh
npm run dev:api                                  # terminal 1
BASE=http://localhost:3000 npm run test:api     # terminal 2
```

Run them **without** `RESEND_API_KEY` set: valid payloads then exercise the
`500 "Could not send message"` path and no email is ever sent.

### Environment variables

| Name             | Scope              | Purpose                                                     |
| ---------------- | ------------------ | ----------------------------------------------------------- |
| `RESEND_API_KEY` | Server-only        | Resend API key used by the contact endpoint                 |
| `CONTACT_TO`     | Server-only        | Destination email for contact-form messages                 |
| `CONTACT_FROM`   | Server-only        | Verified sender address (defaults to `onboarding@resend.dev`) |
| `SITE_URL`       | Build (optional)   | Absolute origin for canonical/OG/sitemap; overrides the constant |

Server-side vars are never committed and never shipped in client code — see
`.env.example` (names only). On Vercel set them in **Project → Settings →
Environment Variables** for Production, Preview and Development.

`SITE_URL` defaults to the `SITE_URL` constant in `src/data/site.ts`
(currently the placeholder `https://portfolio-alexander-nzaywa.vercel.app`).
Change the constant, or set the env var at build time (which wins), when the
site moves to a custom domain.

### Deterministic installs (package-lock.json)

The repo is synced to GitHub through a text-only API transport, so the
lockfile is maintained by a workflow instead of being pushed by hand:
`.github/workflows/lockfile.yml` resolves the dependency tree
(`npm install --package-lock-only`), installs it (`npm ci`), verifies
`npm run lint` + `npm run build`, then commits `package-lock.json` back
to `main`. Vercel's **Install Command** is plain `npm ci`, which consumes
the committed lockfile.

Locally, `npm install` once is enough (the lockfile is gitignored locally
to keep the transport small).

## Replacing media

All media lives in `public/media/`, and **every** path is registered in
exactly one map: `src/data/media.ts` (`MEDIA`). To swap a piece of media:

1. Drop the new file into `public/media/`.
2. Keep the same filename, or update the matching key in `src/data/media.ts`.
3. Components resolve media only through that map — nothing references
   `/media/...` directly.

`/media/landiq-demo.mp4` and `/media/duka-demo.mp4` are referenced but
intentionally absent for now: components fall back to their poster images
when a video is missing. The current SVG files are dark-gradient
placeholders pending real media.

**When real photos/videos arrive**: serve hero slides as WebP/AVIF (the
slides use CSS `background-image`, so switch to `image-set()` or `<img>`
with `srcset` + `type="image/avif"` fallbacks) and keep poster images as
WebP/AVIF too. The `<Video>` component already lazy-plays only in view and
shows posters everywhere else.

### Generated raster assets (og.png, apple-touch-icon.png)

`public/media/og.png` (1200×630) and `public/apple-touch-icon.png` (180×180)
are **generated at build time** by `scripts/decode-assets.mjs`
(`npm run prebuild`) — a pure-Node PNG writer (zlib + a 5×7 bitmap font),
so the repo carries no binary files. To replace them with real designs:
drop the real files into `public/` and remove the matching entries from
`.gitignore` — the generator never overwrites existing files.

## Structure

```
api/                 serverless functions (Vercel) — health check at /api/health
public/media/        images, posters, og.png (generated), (future) videos
scripts/
  decode-assets.mjs  prebuild: renders the og.png / apple-touch-icon.png placeholders (pure Node)
  test-contact-api.sh  curl smoke tests for /api/contact
.github/workflows/   lockfile.yml — resolves, verifies and commits package-lock.json
src/
  components/
    layout/          Navbar (desktop dropdown + mobile sheet), Footer, Layout, ScrollToTop
    sections/        hero, projects, timeline, contact
    ui/              FadeIn, PrimaryButton, GhostButton, SectionHeading, Video
  data/              ALL site content: site (incl. SITE_URL), hero, projects, timeline, services, nav, media
  hooks/             useReducedMotion, useMediaQuery, usePageMeta
  lib/               cn
  pages/             Home (eager), Services + NotFound (lazy-loaded)
```

## Routing & deployment

- Routes: `/` (Home), `/services` (Services), `*` (NotFound).
- Hash targets scroll smoothly: `/#projects`, `/#timeline`, `/#contact`, `/services#duka-manager`, `/services#custom`, `/services#contact`.
- `vercel.json` rewrites everything except `/api/*` to `/index.html` (SPA history fallback), so a refresh on `/services` survives. It also sets security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and caching: immutable for fingerprinted `/assets/*`, 24h for unhashed `/media/*`, `/fonts/*` and icons.
- Vercel: framework preset **Vite**, install `npm ci` (lockfile committed by the lockfile workflow), build `npm run build`, output `dist`, Node 20. Deploys `main` automatically; `/api` functions run serverless.

## Conventions

- Content is never hard-coded in components — it lives in `src/data/*.ts`.
- `npm run lint` and `npm run build` must pass before every commit; commits follow Conventional Commits.
- Mobile-first (verified 360–1440px, no horizontal scroll, touch targets ≥ 44px), `prefers-reduced-motion` respected, keyboard focus always visible, semantic landmarks throughout.
