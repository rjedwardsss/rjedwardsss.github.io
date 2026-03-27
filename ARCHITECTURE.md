# Portfolio Architecture (Next.js)

## 1) Overview

This project is a personal portfolio built with Next.js App Router.  
Its primary purpose is to present professional experience and projects, while also hosting interactive browser demos (for example, Tic-Tac-Toe AI, Flappy Bird AI, and Chapter Ops) under the `/projects/*` route space.

## 2) Tech Stack

- **Framework:** Next.js `16` (App Router)
- **UI:** React `19`
- **Language:** TypeScript
- **Styling:** Component-local style blocks and global CSS (`app/globals.css`)
- **Linting/quality:** ESLint with `eslint-config-next`
- **Deployment:** Vercel (production hosting and build pipeline)
- **Package/runtime tooling:** Node.js + npm scripts (`dev`, `build`, `start`, `lint`)

No external state-management, database, or API client library is present in the current codebase.

## 3) Project Structure

- `app/`
  - Defines routes and page entry points using App Router conventions.
  - Examples:
    - `app/page.tsx` -> `/`
    - `app/projects/page.tsx` -> `/projects`
    - `app/projects/flappy/page.tsx` -> `/projects/flappy`
    - `app/projects/ttt/page.tsx` -> `/projects/ttt`
    - `app/projects/chapter-ops/page.tsx` -> `/projects/chapter-ops`
- `components/`
  - Shared UI pieces (for example, `components/layout/Navbar.tsx` and `components/layout/Footer.tsx`).
  - Used by project pages to keep layout/navigation consistent.
- `public/`
  - Static assets (project thumbnails, profile image, experience images).
  - Served directly by Next.js at root-relative paths.

### Route example: `/projects/flappy`

The route is composed from the folder `app/projects/flappy/`.  
`page.tsx` acts as the route entry (server component), and it renders `FlappyClient.tsx`, which contains the interactive simulation logic.

## 4) Rendering Architecture

This codebase uses both Server and Client Components:

- **Server Components** are used for route entry points and metadata export.
- **Client Components** are used where browser APIs and interactivity are required (`useState`, `useEffect`, canvas animation, event handlers).

The Flappy page is intentionally split into:

- `app/projects/flappy/page.tsx` (server): route wrapper + `metadata` export
- `app/projects/flappy/FlappyClient.tsx` (client): all runtime simulation logic and JSX

This split is required by App Router rules: pages exporting `metadata` cannot be marked with `"use client"`.

## 5) Data & State Flow

Interactive pages are self-contained and manage UI/runtime state locally with React hooks:

- `useState` for visible UI state (generation counters, score, speed, run state)
- `useRef` for mutable simulation state that should not trigger rerenders every frame (animation handles, entities, frame counters)
- `useEffect` for lifecycle setup/cleanup (initialize simulation, attach loop, cancel animation on unmount)

There is no backend data layer in this project today:

- No `app/api/*` routes
- No database integration
- No authenticated server-side data fetching

Most content is static or computed in-browser.

## 6) Deployment

Typical deployment flow is:

1. Push commits to GitHub.
2. Vercel detects branch updates and triggers a build (`next build`).
3. If build checks pass, Vercel publishes a new deployment.
4. The production domain serves the latest successful build.

Each subsequent push repeats this flow, providing automatic redeploys and preview/production updates through Vercel.

## 7) Key Design Decisions

- **Why Next.js App Router:** File-based routing, first-class React Server Component model, and straightforward Vercel deployment fit a portfolio site with mixed static and interactive content.
- **Why client/server split (e.g., Flappy):** Keeps route-level metadata and SEO-friendly server entry points while isolating browser-only logic in client components.
- **Why old static `.html` paths were replaced:** Route consistency under App Router (`/projects/<slug>`), cleaner navigation, and fewer legacy path assumptions across internal links and structured data.

