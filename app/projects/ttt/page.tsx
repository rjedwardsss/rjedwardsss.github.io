"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TTT_STYLES = `
  :root{
    --bg:#0b0c10; --surface:#11131a; --elev:#171a22; --text:#e6e6e6; --muted:#a2a7b3;
    --brand:#38d0c2; --brand-2:#7aa7ff; --radius:16px;
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
  main{ padding:2.5rem 0 3rem;}
  h1{ font-size:clamp(1.6rem,4vw,2.2rem); margin:0 0 .6rem}
  .muted{ color:var(--muted)}
  .panel{ background:var(--surface); border:1px solid rgba(255,255,255,.08); border-radius:var(--radius); padding:1rem; box-shadow:var(--shadow-soft);}
  .controls{ display:flex; flex-wrap:wrap; gap:.6rem; align-items:center; margin-bottom:.8rem;}
  .chip{ display:inline-flex; align-items:center; gap:.4rem; padding:.35rem .7rem; border-radius:999px;
    background:rgba(255,255,255,.06); color:var(--text); border:1px solid rgba(255,255,255,.10);}
  .button{ display:inline-flex; align-items:center; gap:.5rem; border:1px solid transparent;
    background:linear-gradient(135deg,var(--brand),var(--brand-2)); color:#051014; padding:.7rem 1rem;
    border-radius:999px; font-weight:700; box-shadow:var(--shadow-soft); cursor:pointer; text-decoration:none;}
  .button.secondary{ background:transparent; color:var(--text); border-color:rgba(255,255,255,.14); }
  .button:disabled{ opacity:.6; cursor:not-allowed }
  .board{ display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; margin:.6rem auto 0;}
  .cell{ width:120px; height:120px; display:grid; place-items:center; font-weight:900; font-size:2.6rem;
    border-radius:14px; background:var(--elev); border:1px solid rgba(255,255,255,.08); cursor:pointer; user-select:none;}
  .cell.x{ color:#38d0c2 } .cell.o{ color:#7aa7ff }
  @media (max-width:520px){ .cell{ width:96px; height:96px; font-size:2.2rem } }
  footer{ padding:2rem 0; color:var(--muted); border-top:1px solid rgba(255,255,255,.06); text-align:center;}
  .kbd{padding:.15rem .4rem;border:1px solid rgba(255,255,255,.18);border-radius:6px;background:rgba(255,255,255,.05)}

  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.35rem;
    justify-content: center;
    align-items: center;
    margin: 1rem auto;
    max-width: 300px;
  }

  .cell {
    width: 90px;
    height: 90px;
    font-size: 2rem;
    border-radius: 10px;
  }

  @media (max-width: 520px) {
    .board {
      gap: 0.3rem;
      max-width: 260px;
    }
    .cell {
      width: 78px;
      height: 78px;
      font-size: 1.8rem;
    }
  }
`;

type Mark = "X" | "O";
type WinnerCode = Mark | "D" | null;
type CellValue = Mark | null;

const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7];

function other(mark: Mark): Mark {
  return mark === "X" ? "O" : "X";
}

function winner(board: CellValue[]): WinnerCode {
  for (const [a, c, d] of LINES) {
    if (board[a] && board[a] === board[c] && board[a] === board[d]) {
      return board[a];
    }
  }
  return board.every(Boolean) ? "D" : null;
}

function terminalScore(board: CellValue[], aiMark: Mark, depth: number): number | null {
  const w = winner(board);
  if (!w) return null;
  if (w === "D") return 0;
  return w === aiMark ? 10 - depth : -10 + depth;
}

function minimax(
  board: CellValue[],
  player: Mark,
  aiMark: Mark,
  maximizing: boolean,
  depth: number,
  alpha: number,
  beta: number
): number {
  const ts = terminalScore(board, aiMark, depth);
  if (ts !== null) return ts;

  const legal = ORDER.filter((i) => !board[i]);

  if (maximizing) {
    let val = -Infinity;
    for (const i of legal) {
      board[i] = aiMark;
      val = Math.max(val, minimax(board, other(aiMark), aiMark, false, depth + 1, alpha, beta));
      board[i] = null;
      alpha = Math.max(alpha, val);
      if (alpha >= beta) break;
    }
    return val;
  }

  const humanMark = other(aiMark);
  let val = Infinity;
  for (const i of legal) {
    board[i] = humanMark;
    val = Math.min(val, minimax(board, aiMark, aiMark, true, depth + 1, alpha, beta));
    board[i] = null;
    beta = Math.min(beta, val);
    if (alpha >= beta) break;
  }
  return val;
}

function bestMoveMinimax(board: CellValue[], aiMark: Mark): number | null {
  for (const i of ORDER.filter((i) => !board[i])) {
    board[i] = aiMark;
    if (winner(board) === aiMark) {
      board[i] = null;
      return i;
    }
    board[i] = null;
  }

  let best: number | null = null;
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;

  for (const i of ORDER.filter((i) => !board[i])) {
    board[i] = aiMark;
    const score = minimax(board, other(aiMark), aiMark, false, 1, alpha, beta);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
    alpha = Math.max(alpha, score);
  }

  return best;
}

export default function TicTacToePage() {
  const [human, setHuman] = useState<Mark>("X");
  const [ai, setAi] = useState<Mark>("O");
  const [current, setCurrent] = useState<Mark>("X");
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [over, setOver] = useState(false);
  const [status, setStatus] = useState("Click a square to play. Press R to restart.");

  function startNewGame(selectedHuman: Mark) {
    const nextAi = selectedHuman === "X" ? "O" : "X";
    const starter: Mark = "X";

    setHuman(selectedHuman);
    setAi(nextAi);
    setCurrent(starter);
    setBoard(Array(9).fill(null));
    setOver(false);

    if (starter === selectedHuman) {
      setStatus("Your move.");
    } else {
      setStatus("AI moves first…");
    }
  }

  function finish(code: WinnerCode, currentHuman: Mark) {
    setOver(true);
    if (code === "D") setStatus("Draw.");
    else if (code === currentHuman) setStatus("You win! 🎉");
    else setStatus("AI wins. 🤖");
  }

  function play(i: number) {
    if (over || board[i] || current !== human) return;

    const nextBoard = [...board];
    nextBoard[i] = human;

    setBoard(nextBoard);

    const w = winner(nextBoard);
    if (w) {
      finish(w, human);
      return;
    }

    setCurrent(ai);
    setStatus("AI thinking…");
  }

  useEffect(() => {
    startNewGame("X");
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        startNewGame(human);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [human]);

  useEffect(() => {
    if (over || current !== ai) return;

    const timer = window.setTimeout(() => {
      setBoard((prevBoard) => {
        const nextBoard = [...prevBoard];
        const move = bestMoveMinimax(nextBoard, ai);

        if (move == null) {
          setOver(true);
          setStatus("Draw.");
          return prevBoard;
        }

        nextBoard[move] = ai;

        const w = winner(nextBoard);
        if (w) {
          if (w === "D") {
            setStatus("Draw.");
          } else if (w === human) {
            setStatus("You win! 🎉");
          } else {
            setStatus("AI wins. 🤖");
          }
          setOver(true);
          return nextBoard;
        }

        setCurrent(human);
        setStatus("Your move.");
        return nextBoard;
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [ai, current, human, over]);

  return (
    <>
      <style>{TTT_STYLES}</style>

      <Navbar backHref="/projects" backLabel="← Back to Portfolio" />

      <main>
        <div className="container">
          <h1>Tic-Tac-Toe AI</h1>
          <p className="muted">Play against a strong AI using perfect minimax. Choose your mark and go.</p>

          <section className="panel">
            <div className="controls">
              <label className="chip">
                <input
                  type="radio"
                  name="mark"
                  value="X"
                  checked={human === "X"}
                  onChange={() => startNewGame("X")}
                />{" "}
                You: X
              </label>

              <label className="chip">
                <input
                  type="radio"
                  name="mark"
                  value="O"
                  checked={human === "O"}
                  onChange={() => startNewGame("O")}
                />{" "}
                You: O
              </label>

              <button className="button" id="new" onClick={() => startNewGame(human)}>
                New Game
              </button>
            </div>

            <div id="board" className="board" role="grid" aria-label="Tic Tac Toe board">
              {board.map((val, i) => (
                <button
                  key={i}
                  className={`cell${val ? ` ${val.toLowerCase()}` : ""}`}
                  role="gridcell"
                  aria-label={`cell ${i + 1}`}
                  onClick={() => play(i)}
                >
                  {val || ""}
                </button>
              ))}
            </div>

            <p id="status" className="muted">
              {status.includes("Press R") ? (
                <>
                  Click a square to play. Press <span className="kbd">R</span> to restart.
                </>
              ) : (
                status
              )}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}