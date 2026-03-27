/* eslint-disable @next/next/no-img-element -- parity with original static <img> markup */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects | RJ Edwards",
  description:
    "Featured projects by RJ Edwards: Tic-Tac-Toe AI, Flappy Bird AI, and a Chapter Ops Dashboard. Interactive demos + concise technical summaries.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://rjedwardsss.github.io/projects/",
  },
  openGraph: {
    type: "website",
    title: "Projects | RJ Edwards",
    description:
      "Featured projects by RJ Edwards: Tic-Tac-Toe AI, Flappy Bird AI, and a Chapter Ops Dashboard.",
    url: "https://rjedwardsss.github.io/projects/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | RJ Edwards",
    description:
      "Featured projects by RJ Edwards: Tic-Tac-Toe AI, Flappy Bird AI, and a Chapter Ops Dashboard.",
  },
};

const PROJECTS_STYLES = `
    :root {
      --bg: #0b0c10;
      --surface: #11131a;
      --elev: #171a22;
      --text: #e6e6e6;
      --muted: #a2a7b3;
      --brand: #38d0c2;
      --brand-2: #7aa7ff;
      --accent: #c084fc;
      --radius: 16px;
      --shadow: 0 10px 30px rgba(0, 0, 0, .35);
      --shadow-soft: 0 6px 18px rgba(0, 0, 0, .25);
      --maxw: 1100px;
    }

    * {
      box-sizing: border-box;
    }

    html {
      -webkit-text-size-adjust: 100%;
    }

    html,
    body {
      height: 100%;
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      overflow-x: hidden;
      background:
        radial-gradient(1200px 800px at 120% -10%, rgba(56, 208, 194, .25), transparent 60%),
        radial-gradient(800px 600px at -20% 10%, rgba(122, 167, 255, .18), transparent 60%),
        var(--bg);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      line-height: 1.6;
    }

    img,
    svg,
    video {
      max-width: 100%;
      height: auto;
      display: block;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .container {
      width: min(var(--maxw), 100% - 2rem);
      margin: 0 auto;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      border: 1px solid transparent;
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      color: #051014;
      padding: .9rem 1.1rem;
      border-radius: 999px;
      font-weight: 800;
      box-shadow: var(--shadow-soft);
      transition: transform .15s ease, box-shadow .15s ease, opacity .2s ease;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      text-align: center;
    }

    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, .25);
    }

    .button.secondary {
      background: transparent;
      color: var(--text);
      border-color: rgba(255, 255, 255, .12);
      box-shadow: none;
    }

    .button.secondary:hover {
      background: rgba(255, 255, 255, .06);
    }

    /* NAV */
    .nav {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: saturate(120%) blur(8px);
      background: color-mix(in oklab, var(--bg) 86%, transparent);
      border-bottom: 1px solid rgba(255, 255, 255, .06);
    }

    .nav .inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 64px;
      gap: 1rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: .7rem;
      font-weight: 900;
      letter-spacing: .5px;
      white-space: nowrap;
    }

    .brand .logo {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      color: #031016;
      font-weight: 900;
      box-shadow: var(--shadow-soft);
      flex: 0 0 auto;
    }

    .nav a {
      color: var(--muted);
      font-weight: 700;
    }

    .nav a.active {
      color: var(--text);
    }

    .nav .links {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    main {
      padding: 4rem 0;
    }

    h1 {
      font-size: clamp(2rem, 4vw, 2.6rem);
      margin: 0 0 .6rem;
    }

    .lead {
      color: var(--muted);
      max-width: 70ch;
      margin: 0 0 1.5rem;
    }

    /* PROJECT GRID */
    .projects {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1.2rem;
    }

    .card {
      grid-column: span 4;
      background: linear-gradient(180deg, var(--surface), var(--elev));
      border: 1px solid rgba(255, 255, 255, .08);
      border-radius: var(--radius);
      padding: 1.1rem;
      display: flex;
      flex-direction: column;
      gap: .8rem;
      box-shadow: var(--shadow-soft);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }

    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 22px 36px rgba(0, 0, 0, .25);
      border-color: rgba(255, 255, 255, .16);
    }

    .thumb {
      height: 210px;
      border-radius: 12px;
      background: #000;
      border: 1px solid rgba(255, 255, 255, .06);
      box-shadow: var(--shadow-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-bottom: .2rem;
    }

    .thumb-img {
      height: 90%;
      width: auto;
      object-fit: contain;
      display: block;
      filter: contrast(1.05) saturate(1.06);
      transition: transform .25s ease, filter .25s ease;
    }

    .card:hover .thumb-img {
      transform: scale(1.02);
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      padding: .25rem .6rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, .06);
      color: var(--muted);
      font-size: .85rem;
    }

    .chip i {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      display: inline-block;
      background: var(--brand);
    }

    .flex {
      display: flex;
      gap: .6rem;
      align-items: center;
      flex-wrap: wrap;
    }

    @media (max-width: 980px) {
      .card {
        grid-column: span 6;
      }
    }

    @media (max-width: 640px) {
      .card {
        grid-column: span 12;
      }

      .button {
        width: 100%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        scroll-behavior: auto !important;
      }

      .button,
      .card,
      .thumb-img {
        transition: none !important;
      }
    }

    /* FOOTER */
    footer {
      padding: 2.5rem 0 3rem;
      color: var(--muted);
      border-top: 1px solid rgba(255, 255, 255, .06);
    }
`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://rjedwardsss.github.io/projects/#page",
      name: "Projects | RJ Edwards",
      description:
        "Featured projects by RJ Edwards: Tic-Tac-Toe AI, Flappy Bird AI, and a Chapter Ops Dashboard.",
      inLanguage: "en",
      url: "https://rjedwardsss.github.io/projects/",
    },
    {
      "@type": "Person",
      "@id": "https://rjedwardsss.github.io/#rj-edwards",
      name: "RJ Edwards",
      url: "https://rjedwardsss.github.io/",
      sameAs: [
        "https://github.com/rjedwardsss",
        "https://www.linkedin.com/in/rjedwardsss/",
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "Tic-Tac-Toe AI",
      applicationCategory: "Game",
      operatingSystem: "Web",
      description:
        "A browser-based Tic-Tac-Toe AI originally prototyped in Java and re-engineered in JavaScript.",
      author: { "@id": "https://rjedwardsss.github.io/#rj-edwards" },
      url: "https://rjedwardsss.github.io/projects/ttt",
    },
    {
      "@type": "SoftwareApplication",
      name: "Flappy Bird AI",
      applicationCategory: "Game",
      operatingSystem: "Web",
      description:
        "A browser-based Flappy Bird AI using simple neural networks and genetic algorithms, originally prototyped in Python.",
      author: { "@id": "https://rjedwardsss.github.io/#rj-edwards" },
      url: "https://rjedwardsss.github.io/projects/flappy",
    },
    {
      "@type": "SoftwareApplication",
      name: "Chapter Ops Dashboard v1.0",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "A lightweight dashboard for managing chapter operations with tracking for members, dues, events, and tasks.",
      author: { "@id": "https://rjedwardsss.github.io/#rj-edwards" },
      url: "https://rjedwardsss.github.io/projects/chapter-ops",
    },
  ],
};

export default function ProjectsPage() {
  return (
    <>
      <style>{PROJECTS_STYLES}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <header className="nav">
        <div className="container inner">
          <Link className="brand" href="/" aria-label="Home">
            <span className="logo">RJ</span>
            <span>RJ Edwards</span>
          </Link>

          <nav className="links" aria-label="Primary">
            <Link href="/">Home</Link>
            <Link className="active" href="/projects">
              Projects
            </Link>
            <Link href="/#skills">Skills</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <h1>Featured Projects</h1>
          <p className="lead">
            A small selection of work spanning AI/ML experimentation, browser-based
            demos, and lightweight operational tools.
          </p>

          <div className="projects" aria-label="Featured projects list">
            <article className="card">
              <div className="thumb">
                <img
                  className="thumb-img"
                  src="/projects/tictactoe.png"
                  alt="Preview of Tic-Tac-Toe AI project"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h2 style={{ fontSize: "1.2rem", margin: ".2rem 0" }}>
                Tic-Tac-Toe AI
              </h2>
              <p>
                A browser-based implementation of a Tic-Tac-Toe AI originally
                prototyped in Java and re-engineered in JavaScript for seamless
                play directly in the browser.
              </p>
              <div className="flex" aria-label="Tech stack">
                <span className="chip">
                  <i />
                  Java
                </span>
                <span className="chip">
                  <i />
                  JavaScript
                </span>
                <span className="chip">
                  <i />
                  HTML
                </span>
              </div>
              <div className="flex">
                <a
                  className="button"
                  href="/projects/ttt"
                  aria-label="Open Tic-Tac-Toe AI demo"
                >
                  Open Demo
                </a>
              </div>
            </article>

            <article className="card">
              <div className="thumb">
                <img
                  className="thumb-img"
                  src="/projects/flappybird.png"
                  alt="Preview of Flappy Bird AI project"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h2 style={{ fontSize: "1.2rem", margin: ".2rem 0" }}>
                Flappy Bird AI
              </h2>
              <p>
                A browser-based implementation of Flappy Bird using simple neural
                networks and genetic algorithms that was originally prototyped in
                Python.
              </p>
              <div className="flex" aria-label="Tech stack">
                <span className="chip">
                  <i />
                  Python
                </span>
                <span className="chip">
                  <i />
                  NumPy
                </span>
                <span className="chip">
                  <i />
                  ML
                </span>
              </div>
              <div className="flex">
                <a
                  className="button"
                  href="/projects/flappy"
                  aria-label="Open Flappy Bird AI demo"
                >
                  Open Demo
                </a>
              </div>
            </article>

            <article className="card">
              <div className="thumb">
                <img
                  className="thumb-img"
                  src="/projects/dashboard.png"
                  alt="Preview of Chapter Ops Dashboard project"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h2 style={{ fontSize: "1.2rem", margin: ".2rem 0" }}>
                Chapter Ops Dashboard v1.0
              </h2>
              <p>
                A lightweight dashboard for managing chapter operations with
                interactive tracking of members, dues, events, and tasks.
              </p>
              <div className="flex" aria-label="Tech stack">
                <span className="chip">
                  <i />
                  HTML
                </span>
                <span className="chip">
                  <i />
                  JavaScript
                </span>
                <span className="chip">
                  <i />
                  CSS
                </span>
              </div>
              <div className="flex">
                <a
                  className="button"
                  href="/projects/chapter-ops"
                  aria-label="Open Chapter Ops demo"
                >
                  Open Demo
                </a>
              </div>
            </article>
          </div>

          <div
            className="flex"
            style={{ marginTop: "1.6rem", gap: ".8rem" }}
          >
            <Link className="button secondary" href="/">
              Back to Home
            </Link>
            <a
              className="button"
              href="https://github.com/rjedwardsss"
              target="_blank"
              rel="noreferrer noopener"
            >
              More on GitHub
            </a>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <div>
            © {new Date().getFullYear()} RJ Edwards. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
