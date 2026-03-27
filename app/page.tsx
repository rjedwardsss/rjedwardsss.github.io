"use client";

/* eslint-disable @next/next/no-img-element -- parity with original static <img> markup */

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import AskRjAi from "@/components/home/AskRjAi";

const HOME_STYLES = `
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

    @media (prefers-color-scheme: light) {
      :root {
        --bg: #fafafa;
        --surface: #ffffff;
        --elev: #f4f6fb;
        --text: #0f172a;
        --muted: #5b6476;
        --shadow: 0 10px 30px rgba(2, 6, 23, .1);
        --shadow-soft: 0 6px 18px rgba(2, 6, 23, .08);
      }
    }

    [data-theme="light"] {
      --bg: #fafafa;
      --surface: #ffffff;
      --elev: #f4f6fb;
      --text: #0f172a;
      --muted: #5b6476;
      --shadow: 0 10px 30px rgba(2, 6, 23, .1);
      --shadow-soft: 0 6px 18px rgba(2, 6, 23, .08);
    }

    [data-theme="dark"] {
      --bg: #0b0c10;
      --surface: #11131a;
      --elev: #171a22;
      --text: #e6e6e6;
      --muted: #a2a7b3;
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
      /* prevents horizontal scroll on small devices */
      background:
        linear-gradient(rgba(122, 167, 255, .03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(56, 208, 194, .025) 1px, transparent 1px),
        radial-gradient(1200px 800px at 120% -10%, rgba(56, 208, 194, .25), transparent 60%),
        radial-gradient(800px 600px at -20% 10%, rgba(122, 167, 255, .18), transparent 60%),
        radial-gradient(900px 650px at 50% 115%, rgba(56, 189, 248, .10), rgba(34, 211, 238, .06), rgba(96, 165, 250, .04), transparent 66%),
        var(--bg);
      background-size: 36px 36px, 36px 36px, 160% 160%, 160% 160%, 170% 170%, auto;
      background-position: 0 0, 0 0, 0% 0%, 100% 0%, 50% 100%, 0 0;
      animation: bgDrift 30s ease-in-out infinite alternate;
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      line-height: 1.6;
      letter-spacing: .2px;
    }

    @keyframes bgDrift {
      0% {
        background-position: 0 0, 0 0, 0% 0%, 100% 0%, 50% 100%, 0 0;
      }
      100% {
        background-position: 0 0, 0 0, 6% 4%, 94% 6%, 48% 96%, 0 0;
      }
    }

    img,
    video,
    svg {
      max-width: 100%;
      height: auto;
      display: block;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    /* container that behaves well on every viewport */
    .container {
      width: min(var(--maxw), 100% - 2rem);
      margin: 0 auto;
    }

    .button {
      display: inline-flex;
      align-items: center;
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
      text-align: center;
      justify-content: center;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
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
      /* key: keeps nav usable on small screens */
      justify-content: flex-end;
    }

    .theme-toggle {
      border: 1px solid rgba(255, 255, 255, .15);
      border-radius: 999px;
      padding: .35rem .65rem;
      background: transparent;
      color: var(--text);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: .5rem;
      font-weight: 800;
      -webkit-tap-highlight-color: transparent;
    }

    /* HERO */
    .hero {
      padding: 8rem 0 5rem;
      position: relative;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr .8fr;
      gap: 2rem;
      align-items: center;
    }

    .kicker {
      color: var(--brand);
      font-weight: 900;
      letter-spacing: .15em;
      text-transform: uppercase;
      font-size: .9rem;
    }

    h1 {
      font-size: clamp(2rem, 6vw, 3.5rem);
      line-height: 1.05;
      margin: .3rem 0 1rem;
    }

    .sub {
      color: var(--muted);
      font-size: clamp(1rem, 2vw, 1.1rem);
      max-width: 60ch;
    }

    .cta {
      margin-top: 1.5rem;
      display: flex;
      gap: .8rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .hero-card {
      background: linear-gradient(180deg, var(--surface), var(--elev));
      border: 1px solid rgba(255, 255, 255, .06);
      border-radius: var(--radius);
      padding: 1.2rem;
      box-shadow: var(--shadow);
      position: relative;
    }

    .hero-card .stat {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: .8rem 1rem;
      background: rgba(255, 255, 255, .03);
      border-radius: 12px;
      margin: .5rem 0;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      padding: .3rem .6rem;
      border-radius: 999px;
      background: rgba(122, 167, 255, .12);
      color: var(--brand-2);
      font-weight: 800;
      white-space: nowrap;
    }

    /* SECTIONS */
    section {
      padding: 4rem 0;
      position: relative;
      isolation: isolate;
    }

    section::before {
      content: "";
      position: absolute;
      inset: 10% 0 auto;
      height: 140px;
      pointer-events: none;
      background: radial-gradient(45% 75% at 50% 50%, rgba(56, 208, 194, .06), transparent 72%);
      z-index: -1;
    }

    h2 {
      font-size: clamp(1.6rem, 4vw, 2.1rem);
      margin: 0 0 1.2rem;
    }

    .section-sub {
      color: var(--muted);
      max-width: 70ch;
      margin-bottom: 1.5rem;
    }

    /* EXPERIENCE logo wall */
    .logo-wall {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.2rem;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .logo-wall li {
      list-style: none;
    }

    /* Make tiles feel intentional (no "grey card") */
    .logo-item {
      width: 100%;
      aspect-ratio: 1 / 1;
      display: grid;
      place-items: center;
      border-radius: 18px;
      overflow: hidden;
      text-decoration: none;

      background: linear-gradient(180deg, rgba(255, 255, 255, .04), rgba(255, 255, 255, .015));
      border: 1px solid rgba(255, 255, 255, .08);
      box-shadow: 0 10px 24px rgba(0, 0, 0, .22);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }

    .logo-item:hover {
      transform: translateY(-4px);
      border-color: rgba(56, 208, 194, .25);
      box-shadow:
        0 16px 34px rgba(0, 0, 0, .28),
        0 0 0 1px rgba(56, 208, 194, .10) inset;
    }

    /* This is the key: contain + padding so all logos look consistent */
    .logo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;



      /* Helps logos look less "flat" without changing their colors */
      filter: contrast(1.02) saturate(1.02);
    }

    /* Responsive logo columns */
    @media (max-width: 980px) {
      .logo-wall {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 640px) {
      .logo-wall {
        grid-template-columns: repeat(2, 1fr);
      }
    }



    /* SKILLS */
    .skills {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .panel {
      background: var(--surface);
      border: 1px solid rgba(255, 255, 255, .06);
      border-radius: var(--radius);
      padding: 1.2rem;
      box-shadow: var(--shadow-soft);
      --ui-lift-y: -3px;
      --ui-lift-border: rgba(122, 167, 255, .24);
      --ui-lift-shadow: 0 14px 30px rgba(0, 0, 0, .24), 0 0 0 1px rgba(56, 208, 194, .08) inset;
    }

    .meter {
      background: var(--elev);
      border: 1px solid rgba(255, 255, 255, .06);
      border-radius: 12px;
      overflow: hidden;
    }

    .meter .bar {
      height: 10px;
      background: linear-gradient(90deg, var(--brand), var(--accent));
      width: 100%;
      transform-origin: left center;
      transform: scaleX(0);
      transition: transform .85s cubic-bezier(.2, .9, .3, 1);
    }

    .panel.in .bar {
      transform: scaleX(var(--fill, .7));
    }

    .ask-ai {
      margin-top: 1rem;
    }

    .ask-ai-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .8rem;
      margin-bottom: .6rem;
    }

    .ask-ai-sub {
      margin-bottom: .9rem;
    }

    .ask-ai-prompts {
      display: flex;
      flex-wrap: wrap;
      gap: .55rem;
      margin-bottom: .9rem;
    }

    .chip.ask-chip {
      background: rgba(255, 255, 255, .06);
      color: rgba(230, 236, 248, .96);
      border: 1px solid rgba(56, 189, 248, .22);
      cursor: pointer;
      --ui-lift-y: -1px;
      --ui-lift-border: rgba(56, 208, 194, .42);
      --ui-lift-shadow: 0 8px 16px rgba(0, 0, 0, .22), 0 0 0 1px rgba(56, 208, 194, .14) inset;
    }

    .chip.ask-chip:hover {
      background: rgba(255, 255, 255, .08);
    }

    .chip.ask-chip:focus-visible {
      outline: 2px solid rgba(56, 189, 248, .45);
      outline-offset: 2px;
    }

    .ask-ai-compose {
      display: flex;
      gap: .6rem;
      align-items: center;
      margin: 0 0 .9rem;
    }

    .ask-ai-compose input {
      width: 100%;
      padding: .72rem .85rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, .12);
      background: var(--elev);
      color: var(--text);
      outline: none;
    }

    .ask-ai-compose input:focus {
      border-color: rgba(56, 208, 194, .3);
      box-shadow: 0 0 0 2px rgba(56, 208, 194, .14);
    }

    .ask-ai-thread {
      display: grid;
      gap: .55rem;
    }

    .msg {
      border-radius: 12px;
      padding: .65rem .75rem;
      border: 1px solid rgba(255, 255, 255, .08);
      background: rgba(255, 255, 255, .03);
    }

    .msg.user {
      border-color: rgba(122, 167, 255, .3);
      background: rgba(122, 167, 255, .09);
    }

    .msg.assistant {
      border-color: rgba(56, 208, 194, .25);
    }

    .msg-role {
      display: inline-block;
      font-size: .78rem;
      font-weight: 800;
      letter-spacing: .04em;
      opacity: .85;
      margin-bottom: .2rem;
    }

    .msg p {
      margin: 0;
      color: var(--text);
    }

    .current-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .current-item h3 {
      margin: 0 0 .35rem;
      font-size: 1rem;
    }

    .current-item p {
      margin: 0;
      color: var(--muted);
      font-size: .95rem;
    }

    /* CONTACT */
    .contact {
      display: grid;
      grid-template-columns: 1.1fr .9fr;
      gap: 1.8rem;
      align-items: start;
    }

    .panel input,
    .panel textarea {
      width: 100%;
      padding: .85rem 1rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, .12);
      background: var(--elev);
      color: var(--text);
      outline: none;
    }

    .panel textarea {
      min-height: 140px;
      resize: vertical;
    }

    /* Form layout: 2 columns, subject spans full width */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.2rem;
    }

    .grid-2 .full {
      grid-column: 1 / -1;
    }

    button[type="submit"] {
      border: 1px solid rgba(255, 255, 255, .12);
    }

    .photo-panel {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .profile-photo {
      width: 260px;
      height: auto;
      border-radius: 16px;
      object-fit: cover;
      box-shadow: 0 8px 24px rgba(0, 0, 0, .45), 0 0 20px rgba(56, 208, 194, .15);
      transition: transform .4s ease, box-shadow .4s ease, filter .4s ease;
      filter: brightness(.95) contrast(1.05);
    }

    .profile-photo:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 32px rgba(0, 0, 0, .55), 0 0 28px rgba(122, 167, 255, .3);
      filter: brightness(1) contrast(1.1);
    }

    /* FOOTER */
    footer {
      padding: 2.5rem 0 3rem;
      color: var(--muted);
      border-top: 1px solid rgba(255, 255, 255, .06);
    }

    /* animations */
    [data-animate] {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity .6s ease, transform .6s ease;
    }

    [data-animate].in {
      opacity: 1;
      transform: translateY(0);
    }

    /* RESPONSIVE */
    @media (max-width: 980px) {
      .hero {
        padding: 6rem 0 4rem;
      }

      .hero-grid {
        grid-template-columns: 1fr;
      }

      .skills {
        grid-template-columns: repeat(2, 1fr);
      }

      .current-grid {
        grid-template-columns: 1fr;
      }

      .contact {
        grid-template-columns: 1fr;
      }

      .logo-wall {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 640px) {
      section {
        padding: 3rem 0;
      }

      .hero {
        padding: 5rem 0 3rem;
      }

      /* Buttons become full-width for good tap targets */
      .cta {
        gap: .6rem;
      }

      .cta .button {
        width: 100%;
      }

      /* Keep nav usable on mobile (wrapped links) */
      .nav .inner {
        padding: .8rem 0;
        align-items: flex-start;
      }

      .nav .links {
        gap: .6rem;
      }

      .skills {
        grid-template-columns: 1fr;
      }

      .ask-ai-head {
        flex-direction: column;
        align-items: flex-start;
      }

      .ask-ai-compose {
        flex-direction: column;
        align-items: stretch;
      }

      .ask-ai-compose .button {
        width: 100%;
      }

      .logo-wall {
        grid-template-columns: repeat(2, 1fr);
      }

      /* Contact fields stack on small devices */
      .grid-2 {
        grid-template-columns: 1fr;
      }

      .profile-photo {
        width: min(320px, 100%);
      }
    }

    /* Accessibility: respect reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        scroll-behavior: auto !important;
      }

      [data-animate] {
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
      }

      .button,
      .logo-item,
      .profile-photo,
      .panel,
      .meter .bar,
      .chip.ask-chip,
      .ui-lift {
        transition: none !important;
      }
    }
`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "RJ Edwards",
  url: "https://rjedwardsss.github.io/",
  sameAs: [
    "https://github.com/rjedwardsss",
    "https://www.linkedin.com/in/rjedwardsss/",
  ],
  jobTitle: "Data Science & Software Engineering Student",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Wisconsin-Madison",
  },
};

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial =
      stored === "light" || stored === "dark"
        ? stored
        : prefersDark
          ? "dark"
          : "light";
    root.setAttribute("data-theme", initial);
    // Sync React state with persisted / system preference after mount (same as original inline script).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time hydration
    setTheme(initial);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    document.querySelectorAll("[data-animate]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const applyTheme = (t: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    setTheme(t);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
  };

  return (
    <>
      <style>{HOME_STYLES}</style>
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
            <Link href="/" className="active">
              Home
            </Link>
            <Link href="/projects">Projects</Link>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
            <button
              className="theme-toggle"
              id="themeToggle"
              type="button"
              title="Toggle theme"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "🌙 " : "☀️ "}
              <span className="label">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-grid">
            <div>
              <div className="kicker" data-animate>
                Data Science • Computer Science • Leadership
              </div>
              <h1 data-animate style={{ transitionDelay: ".08s" }}>
                Hi, I&apos;m RJ. I build AI systems that interact, adapt, and solve
                real-world problems.
              </h1>

              <p
                className="sub"
                data-animate
                style={{ transitionDelay: ".12s" }}
              >
                I&apos;m a Computer Science and Data Science student at the
                University of Wisconsin-Madison passionate about technology,
                analytics, and turning data into impactful solutions. My work
                spans software development, AI/ML experimentation, and
                leadership.
              </p>

              <div className="cta" data-animate style={{ transitionDelay: ".16s" }}>
                <Link className="button" href="/projects">
                  View Projects
                </Link>
                <a
                  className="button secondary"
                  href="https://github.com/rjedwardsss"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub
                </a>
                <a
                  className="button"
                  href="https://www.linkedin.com/in/rjedwardsss/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <aside>
              <div className="hero-card" data-animate>
                <div className="stat">
                  <strong>Current Focus</strong>
                  <span className="pill">Data • ML • Web</span>
                </div>
                <div className="stat">
                  <strong>Education</strong>
                  <span>University of Wisconsin-Madison</span>
                </div>
                <div className="stat">
                  <strong>Credentials</strong>
                  <span>Data Science, B.S.</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="currently-building">
          <div className="container">
            <h2 data-animate>Currently Building</h2>
            <p className="section-sub" data-animate style={{ transitionDelay: ".05s" }}>
              Active product and engineering focus areas I&apos;m shipping right now.
            </p>

            <div className="current-grid">
              <div className="panel current-item ui-lift" data-animate>
                <h3>AI interaction systems @ StageKeep</h3>
                <p>
                  Conversational workflow surfaces that turn user intent into clear actions.
                </p>
              </div>

              <div className="panel current-item ui-lift" data-animate style={{ transitionDelay: ".05s" }}>
                <h3>Portfolio platform (this site)</h3>
                <p>
                  Evolving this portfolio into a product-quality interactive showcase with AI demos.
                </p>
              </div>

              <div className="panel current-item ui-lift" data-animate style={{ transitionDelay: ".1s" }}>
                <h3>Applied ML + frontend systems</h3>
                <p>
                  Building practical AI features with strong UX, performance, and reliability constraints.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="container">
            <h2 data-animate>Experience</h2>
            <p
              className="section-sub"
              data-animate
              style={{ transitionDelay: ".06s" }}
            >
              Companies and organizations I&apos;ve worked with. For even more
              detailed roles and responsibilities, see my LinkedIn. Click the
              logos to learn more.
            </p>

            <ul className="logo-wall" aria-label="Organizations worked with">
              <li>
                <a
                  className="logo-item"
                  href="https://stagekeep.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="StageKeep"
                >
                  <img
                    src="/experience/stagekeep.png"
                    alt="StageKeep logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://okaylisa.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="okaylisa"
                >
                  <img
                    src="/experience/okaylisa.jpg"
                    alt="okaylisa logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.steppy.ai/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Steppy AI"
                >
                  <img
                    src="/experience/steppyai.png"
                    alt="Steppy AI logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.wisc.edu/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="University of Wisconsin-Madison"
                >
                  <img
                    src="/experience/uwmadison.png"
                    alt="University of Wisconsin-Madison logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.hunterirrigation.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Hunter Industries"
                >
                  <img
                    src="/experience/hunterindustries.jpeg"
                    alt="Hunter Industries logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.joinsaturn.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Saturn Technologies"
                >
                  <img
                    src="/experience/saturnapp.jpeg"
                    alt="Saturn Technologies logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://alphasig.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Alpha Sigma Phi Fraternity"
                >
                  <img
                    src="/experience/alphasig.jpeg"
                    alt="Alpha Sigma Phi Fraternity logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.rcoe.us/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Riverside County Office of Education"
                >
                  <img
                    src="/experience/riversideofficeofeducation.jpg"
                    alt="Riverside County Office of Education logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.redcross.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="American Red Cross"
                >
                  <img
                    src="/experience/americanredcross.jpg"
                    alt="American Red Cross logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.moval.org/mv-library/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Moreno Valley Public Library"
                >
                  <img
                    src="/experience/morenovalleylibrary.jpg"
                    alt="Moreno Valley Public Library logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="http://www.humorology.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Humorology"
                >
                  <img
                    src="/experience/humorology.png"
                    alt="Humorology logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.instagram.com/vvhs.cshonorsociety/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Valley View High School Computer Science Honor Society"
                >
                  <img
                    src="/experience/vvhs-cs-honor-society.jpg"
                    alt="Valley View HS Computer Science Honor Society logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://valleyview.mvusd.net/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Valley View High School"
                >
                  <img
                    src="/experience/valleyview.png"
                    alt="Valley View High School logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>

              <li>
                <a
                  className="logo-item"
                  href="https://www.nationalhonorsociety.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="National Honor Society"
                >
                  <img
                    src="/experience/nationalhonorsociety.png"
                    alt="National Honor Society logo"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section id="skills">
          <div className="container">
            <h2 data-animate>Technical Skills</h2>

            <div className="skills">
              <div className="panel ui-lift" data-animate>
                <strong>Python</strong>
                <div className="meter" aria-label="Python proficiency meter">
                  <div className="bar" style={{ "--fill": ".85" } as CSSProperties} />
                </div>
                <p className="section-sub">NumPy, Pandas, scikit-learn</p>
              </div>

              <div
                className="panel ui-lift"
                data-animate
                style={{ transitionDelay: ".05s" }}
              >
                <strong>Java</strong>
                <div className="meter" aria-label="Java proficiency meter">
                  <div className="bar" style={{ "--fill": ".70" } as CSSProperties} />
                </div>
                <p className="section-sub">OOP, algorithms, data structures</p>
              </div>

              <div
                className="panel ui-lift"
                data-animate
                style={{ transitionDelay: ".1s" }}
              >
                <strong>Web</strong>
                <div className="meter" aria-label="Web proficiency meter">
                  <div className="bar" style={{ "--fill": ".75" } as CSSProperties} />
                </div>
                <p className="section-sub">HTML, CSS, JavaScript, APIs</p>
              </div>
            </div>

            <AskRjAi />
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <h2 data-animate>Contact Me</h2>

            <div className="contact">
              <div className="panel ui-lift" data-animate>
                <form
                  action="https://formspree.io/f/mreepybw"
                  method="POST"
                >
                  <input type="text" name="_gotcha" style={{ display: "none" }} />

                  <div className="grid-2">
                    <div>
                      <label htmlFor="name">Name</label>
                      <input
                        id="name"
                        name="name"
                        placeholder="Please enter your name."
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Please enter your email."
                        required
                      />
                    </div>

                    <div className="full">
                      <label htmlFor="subject">Subject</label>
                      <input
                        id="subject"
                        name="subject"
                        placeholder="Please enter the subject."
                        required
                      />
                    </div>
                  </div>

                  <div style={{ margin: ".8rem 0" }}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Please enter your message here."
                      required
                    />
                  </div>

                  <div className="cta">
                    <button className="button secondary" type="submit">
                      Send Email
                    </button>
                  </div>
                </form>
              </div>

              <div
                className="panel photo-panel ui-lift"
                data-animate
                style={{ transitionDelay: ".05s" }}
              >
                <img
                  src="/contact/profile.jpg"
                  alt="RJ Edwards headshot"
                  className="profile-photo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>
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
