"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FLAPPY_STYLES = `
  :root{
    --bg:#0b0c10; --surface:#11131a; --elev:#171a22; --text:#e6e6e6; --muted:#a2a7b3;
    --brand:#38d0c2; --brand-2:#7aa7ff; --accent:#c084fc; --radius:16px;
    --shadow:0 10px 30px rgba(0,0,0,.35); --shadow-soft:0 6px 18px rgba(0,0,0,.25);
  }
  @media (prefers-color-scheme: light){
    :root{ --bg:#fafafa; --surface:#ffffff; --elev:#f4f6fb; --text:#0f172a; --muted:#5b6476;
    --shadow:0 10px 30px rgba(2,6,23,.1); --shadow-soft:0 6px 18px rgba(2,6,23,.08); }
  }
  *{box-sizing:border-box}
  body{
    margin:0; font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
    background:
      linear-gradient(rgba(122,167,255,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,208,194,.025) 1px, transparent 1px),
      radial-gradient(1200px 800px at 120% -10%, rgba(56,208,194,.25), transparent 60%),
      radial-gradient(800px 600px at -20% 10%, rgba(122,167,255,.18), transparent 60%),
      radial-gradient(900px 650px at 50% 115%, rgba(56,189,248,.10), rgba(34,211,238,.06), rgba(96,165,250,.04), transparent 66%),
      var(--bg);
    background-size:36px 36px, 36px 36px, 160% 160%, 160% 160%, 170% 170%, auto;
    background-position:0 0, 0 0, 0% 0%, 100% 0%, 50% 100%, 0 0;
    animation:bgDrift 30s ease-in-out infinite alternate;
    color:var(--text); line-height:1.6; letter-spacing:.2px;
  }
  @keyframes bgDrift{
    0%{ background-position:0 0, 0 0, 0% 0%, 100% 0%, 50% 100%, 0 0; }
    100%{ background-position:0 0, 0 0, 6% 4%, 94% 6%, 48% 96%, 0 0; }
  }
  header{ position:sticky; top:0; z-index:10; backdrop-filter:saturate(120%) blur(8px);
    background: color-mix(in oklab, var(--bg) 86%, transparent);
    border-bottom:1px solid rgba(255,255,255,.06);}
  .container{ max-width:960px; margin:0 auto; padding:0 1.2rem;}
  .nav{ display:flex; align-items:center; justify-content:space-between; height:64px; }
  .brand{ display:flex; gap:.7rem; align-items:center; font-weight:800}
  .logo{ width:32px;height:32px; display:grid; place-items:center; border-radius:10px;
    background:linear-gradient(135deg,var(--brand),var(--brand-2)); color:#031016; box-shadow:var(--shadow-soft);}
  main{ padding:2.2rem 0 3rem;}
  h1{ font-size:clamp(1.6rem,4vw,2.2rem); margin:0 0 .6rem}
  .muted{ color:var(--muted)}
  .panel{ background:var(--surface); border:1px solid rgba(255,255,255,.08); border-radius:var(--radius); padding:1rem; box-shadow:var(--shadow-soft);}
  .controls{ display:flex; flex-wrap:wrap; gap:.6rem; align-items:center; margin-bottom: .8rem;}
  .chip{ display:inline-flex; align-items:center; gap:.4rem; padding:.35rem .7rem; border-radius:999px;
    background:rgba(255,255,255,.06); color:var(--text); border:1px solid rgba(255,255,255,.10);}
  .button{ display:inline-flex; align-items:center; gap:.5rem; border:1px solid transparent;
    background:linear-gradient(135deg,var(--brand),var(--brand-2)); color:#051014; padding:.7rem 1rem;
    border-radius:999px; font-weight:700; box-shadow:var(--shadow-soft); cursor:pointer;}
  .button.secondary{ background:transparent; color:var(--text); border-color:rgba(255,255,255,.14); }
  .button:disabled{ opacity:.6; cursor:not-allowed }
  .right{ margin-left:auto; display:flex; gap:.6rem; align-items:center; }
  .slider{ appearance:none; width:160px; height:8px; border-radius:999px;
    background:rgba(255,255,255,.1); outline:none; overflow:hidden; }
  .slider::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%;
    background:linear-gradient(135deg,var(--brand),var(--brand-2)); cursor:pointer; box-shadow:0 0 0 4px rgba(255,255,255,.15); }
  .hud{ display:flex; gap:.6rem; flex-wrap:wrap; margin:.4rem 0 0; color:var(--muted) }
  .tag{ background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:999px; padding:.25rem .6rem; }
  canvas{ width:100%; max-width:720px; height:auto; border-radius:14px; border:1px solid rgba(255,255,255,.08); background:#0b0c10; display:block; margin:0.6rem auto; }
  footer{ padding:1.4rem 0 1.6rem; color:var(--muted); border-top:1px solid rgba(255,255,255,.06); text-align:center;}
`;

const W = 720;
const H = 420;
const GRAVITY = 0.4;
const FLAP_V = -7.5;
const PIPE_W = 60;
const GAP_MIN = 105;
const GAP_MAX = 165;
const PIPE_SPACING = 160;
const PIPE_SPEED = 2.6;
const POP_SIZE = 24;
const ELITE_COUNT = 6;
const MUTATION_RATE = 0.15;
const MUTATION_SCALE = 0.35;
const INPUTS = 5;
const HIDDEN = 6;
const OUTPUTS = 1;

type Brain = {
  W1: number[][];
  b1: number[];
  W2: number[][];
  b2: number[];
};

type Pipe = {
  x: number;
  gapY: number;
  gapH: number;
  w: number;
  passed: boolean;
};

class Bird {
  x = 110;
  y = H / 2;
  vy = 0;
  alive = true;
  score = 0;
  passed = 0;
  brain: Brain;

  constructor(brain?: Brain) {
    this.brain = brain || Bird.randomBrain();
  }

  think(nearest?: Pipe) {
    const px = nearest ? nearest.x : W;
    const gapY = nearest ? nearest.gapY : H / 2;
    const gapH = nearest ? nearest.gapH : 140;

    const x1 = this.y / H;
    const x2 = this.vy / 10;
    const x3 = (gapY - gapH / 2) / H;
    const x4 = (gapY + gapH / 2) / H;
    const x5 = (px - this.x) / W;

    const out = Bird.forward(this.brain, [x1, x2, x3, x4, x5])[0];
    if (out > 0.5) this.flap();
  }

  flap() {
    this.vy = FLAP_V;
  }

  update() {
    this.vy += GRAVITY;
    this.y += this.vy;
    this.score++;
    if (this.y < 8 || this.y > H - 8) this.alive = false;
  }

  static randomBrain(): Brain {
    return {
      W1: randMat(HIDDEN, INPUTS, 0.6),
      b1: randVec(HIDDEN, 0.3),
      W2: randMat(OUTPUTS, HIDDEN, 0.6),
      b2: randVec(OUTPUTS, 0.3),
    };
  }

  static mutate(brain: Brain): Brain {
    return {
      W1: brain.W1.map((r) => r.map((v) => mutateValue(v))),
      b1: brain.b1.map((v) => mutateValue(v)),
      W2: brain.W2.map((r) => r.map((v) => mutateValue(v))),
      b2: brain.b2.map((v) => mutateValue(v)),
    };
  }

  static copy(brain: Brain): Brain {
    return {
      W1: brain.W1.map((r) => r.slice()),
      b1: brain.b1.slice(),
      W2: brain.W2.map((r) => r.slice()),
      b2: brain.b2.slice(),
    };
  }

  static forward(brain: Brain, x: number[]): number[] {
    const h = new Array(HIDDEN).fill(0);
    for (let j = 0; j < HIDDEN; j++) {
      let s = brain.b1[j];
      for (let i = 0; i < INPUTS; i++) s += brain.W1[j][i] * x[i];
      h[j] = Math.tanh(s);
    }

    const out = new Array(OUTPUTS).fill(0);
    for (let k = 0; k < OUTPUTS; k++) {
      let s = brain.b2[k];
      for (let j = 0; j < HIDDEN; j++) s += brain.W2[k][j] * h[j];
      out[k] = 1 / (1 + Math.exp(-s));
    }
    return out;
  }
}

function mutateValue(v: number): number {
  if (Math.random() < MUTATION_RATE) {
    return v + (Math.random() * 2 - 1) * MUTATION_SCALE;
  }
  return v;
}

function randMat(rows: number, cols: number, s: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() * 2 - 1) * s)
  );
}

function randVec(n: number, s: number): number[] {
  return Array.from({ length: n }, () => (Math.random() * 2 - 1) * s);
}

function randBetween(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

export default function FlappyClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const flockRef = useRef<Bird[]>([]);
  const pipesRef = useRef<Pipe[]>([]);
  const frameRef = useRef(0);
  const genRef = useRef(1);
  const bestScoreRef = useRef(0);
  const scoreRef = useRef(0);
  const simSpeedRef = useRef(3);

  const [gen, setGen] = useState(1);
  const [alive, setAlive] = useState(0);
  const [score, setScore] = useState(0);
  const [simSpeed, setSimSpeed] = useState(3);
  const [isRunning, setIsRunning] = useState(false);

  function spawnPipe() {
    const gapH = randBetween(GAP_MIN, GAP_MAX);
    const gapY = randBetween(100, H - 100);
    pipesRef.current.push({ x: W + 20, gapY, gapH, w: PIPE_W, passed: false });
  }

  function resetWorld() {
    pipesRef.current = [];
    frameRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    spawnPipe();
  }

  function makeFlock(seedBrains?: Brain[]) {
    const nextFlock: Bird[] = [];
    for (let i = 0; i < POP_SIZE; i++) {
      const brain = seedBrains
        ? Bird.mutate(seedBrains[i % seedBrains.length])
        : Bird.randomBrain();
      nextFlock.push(new Bird(brain));
    }
    flockRef.current = nextFlock;
    setAlive(nextFlock.length);
  }

  function nextGeneration() {
    const scored = flockRef.current
      .slice()
      .sort((a, b) => b.passed * 1000 + b.score - (a.passed * 1000 + a.score));

    const elites = scored.slice(0, ELITE_COUNT).map((b) => Bird.copy(b.brain));
    if (scored[0]) {
      bestScoreRef.current = Math.max(
        bestScoreRef.current,
        scored[0].passed * 1000 + scored[0].score
      );
    }

    genRef.current += 1;
    setGen(genRef.current);
    resetWorld();
    makeFlock(elites);
  }

  function update() {
    for (let s = 0; s < simSpeedRef.current; s++) {
      frameRef.current++;

      if (frameRef.current % PIPE_SPACING === 0) spawnPipe();

      pipesRef.current.forEach((p) => {
        p.x -= PIPE_SPEED;
      });
      pipesRef.current = pipesRef.current.filter((p) => p.x + p.w > -10);

      const nearest = pipesRef.current.find((p) => p.x + p.w > 100);

      let aliveCount = 0;

      for (const b of flockRef.current) {
        if (!b.alive) continue;

        b.think(nearest);
        b.update();

        if (nearest) {
          if (b.x > nearest.x - 10 && b.x < nearest.x + nearest.w + 10) {
            if (!(b.y > nearest.gapY - nearest.gapH / 2 && b.y < nearest.gapY + nearest.gapH / 2)) {
              b.alive = false;
            }
          }

          if (!nearest.passed && b.x > nearest.x + nearest.w) {
            nearest.passed = true;
            b.passed++;
            scoreRef.current++;
          }
        }

        if (b.alive) aliveCount++;
      }

      setAlive(aliveCount);
      setScore(scoreRef.current);

      if (aliveCount === 0) {
        nextGeneration();
        break;
      }
    }
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#0b0c10";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#38d0c2";
    pipesRef.current.forEach((p) => {
      ctx.fillRect(p.x, 0, p.w, p.gapY - p.gapH / 2);
      ctx.fillRect(p.x, p.gapY + p.gapH / 2, p.w, H - (p.gapY + p.gapH / 2));
    });

    for (const b of flockRef.current) {
      if (!b.alive) continue;
      ctx.fillStyle = "#c084fc";
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText(`Gen ${genRef.current}  Score ${scoreRef.current}`, 10, 18);
  }

  function loop() {
    update();
    draw();
    animRef.current = window.requestAnimationFrame(loop);
  }

  function startSimulation() {
    if (animRef.current === null) {
      animRef.current = window.requestAnimationFrame(loop);
      setIsRunning(true);
    }
  }

  function stopSimulation() {
    if (animRef.current !== null) {
      window.cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setIsRunning(false);
  }

  function resetSimulation() {
    stopSimulation();
    genRef.current = 1;
    setGen(1);
    resetWorld();
    makeFlock();
    draw();
  }

  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);

  useEffect(() => {
    resetWorld();
    makeFlock();
    draw();

    return () => {
      if (animRef.current !== null) {
        window.cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{FLAPPY_STYLES}</style>

      <Navbar backHref="/projects" backLabel="← Back to Portfolio" />

      <main>
        <div className="container">
          <h1>Flappy Bird AI</h1>
          <p className="muted">
            A browser simulation where a flock of birds evolves tiny neural nets to survive longer.
            Start a run, adjust the speed, and watch generations improve.
          </p>

          <section className="panel">
            <div className="controls">
              <button className="button" onClick={startSimulation} disabled={isRunning}>
                Start
              </button>
              <button className="button secondary" onClick={stopSimulation} disabled={!isRunning}>
                Stop
              </button>
              <button className="button secondary" onClick={resetSimulation}>
                Reset
              </button>

              <div className="right">
                <span className="chip">Speed</span>
                <input
                  className="slider"
                  type="range"
                  min="1"
                  max="8"
                  value={simSpeed}
                  step="1"
                  onChange={(e) => setSimSpeed(parseInt(e.target.value, 10))}
                />
                <span className="chip">{simSpeed}×</span>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={720}
              height={420}
              aria-label="Flappy Bird canvas"
            />

            <div className="hud">
              <span className="tag">
                Gen: <strong>{gen}</strong>
              </span>
              <span className="tag">
                Alive: <strong>{alive}</strong>
              </span>
              <span className="tag">
                Score: <strong>{score}</strong>
              </span>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
