"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHAPTER_OPS_STYLES = `
  :root{
    --bg:#0b0c10; --surface:#11131a; --elev:#171a22; --text:#e6e6e6; --muted:#a2a7b3;
    --brand:#38d0c2; --brand-2:#7aa7ff; --accent:#c084fc; --radius:16px;
    --shadow:0 10px 30px rgba(0,0,0,.35); --shadow-soft:0 6px 18px rgba(0,0,0,.25);
    --ok:#22c55e; --warn:#f59e0b; --danger:#ef4444;
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
  .container{ max-width:1100px; margin:0 auto; padding:0 1.2rem;}
  .nav{ display:flex; align-items:center; justify-content:space-between; height:64px; }
  .brand{ display:flex; gap:.7rem; align-items:center; font-weight:800}
  .logo{ width:32px;height:32px; display:grid; place-items:center; border-radius:10px;
    background:linear-gradient(135deg,var(--brand),var(--brand-2)); color:#031016; box-shadow:var(--shadow-soft);}
  .button{ display:inline-flex; align-items:center; gap:.5rem; border:1px solid transparent;
    background:linear-gradient(135deg,var(--brand),var(--brand-2)); color:#051014; padding:.6rem .9rem;
    border-radius:999px; font-weight:700; box-shadow:var(--shadow-soft); cursor:pointer;}
  .button.secondary{ background:transparent; color:var(--text); border-color:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.14);}
  .chip{ display:inline-flex; align-items:center; gap:.35rem; padding:.25rem .6rem; border-radius:999px; background:rgba(255,255,255,.06); color:var(--muted); font-size:.9rem; border:1px solid rgba(255,255,255,.08)}
  h1{ font-size:clamp(1.6rem,4vw,2.2rem); margin:.6rem 0 1rem}
  main{ padding:1.6rem 0 2.2rem;}
  .grid{ display:grid; grid-template-columns: 1.2fr .8fr; gap:1rem; }
  .panel{ background:var(--surface); border:1px solid rgba(255,255,255,.08); border-radius:var(--radius); padding:1rem; box-shadow:var(--shadow-soft);}
  .section-title{ display:flex; align-items:center; justify-content:space-between; gap:.6rem; margin-bottom:.6rem }
  input, select{ background:var(--elev); color:var(--text); border:1px solid rgba(255,255,255,.12); border-radius:10px; padding:.55rem .7rem; outline:none; }
  table{ width:100%; border-collapse:separate; border-spacing:0 8px; }
  th, td{ text-align:left; padding:.55rem .6rem;}
  thead th{ color:var(--muted); font-weight:800; font-size:.9rem;}
  tbody tr{ background:var(--elev); border:1px solid rgba(255,255,255,.08); }
  tbody tr td:first-child{ border-top-left-radius:10px; border-bottom-left-radius:10px; }
  tbody tr td:last-child{ border-top-right-radius:10px; border-bottom-right-radius:10px; }
  .status{ display:inline-flex; align-items:center; gap:.35rem; padding:.2rem .55rem; border-radius:999px; font-weight:700; font-size:.85rem; }
  .paid{ background:rgba(34,197,94,.12); color:#22c55e; border:1px solid rgba(34,197,94,.35);}
  .partial{ background:rgba(245,158,11,.12); color:#f59e0b; border:1px solid rgba(245,158,11,.35);}
  .due{ background:rgba(239,68,68,.12); color:#ef4444; border:1px solid rgba(239,68,68,.35);}
  .row{ display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; }
  .totals{ display:flex; gap:.6rem; flex-wrap:wrap; color:var(--muted); }
  .pill{ background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:999px; padding:.25rem .6rem; }
  .cols{ display:grid; grid-template-columns: repeat(3, 1fr); gap:.7rem; }
  .kanban{ display:grid; grid-template-columns: repeat(3,1fr); gap:.7rem; }
  .col{ background:var(--elev); border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:.6rem; min-height:170px; }
  .task{ background:var(--surface); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:.5rem .6rem; margin:.4rem 0; cursor:grab; }
  .event{ background:var(--elev); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:.6rem; display:grid; gap:.35rem; }
  .event strong{ font-weight:800;}
  .event small{ color:var(--muted); }
  .rsvp button{ padding:.35rem .55rem; border-radius:8px; border:1px solid rgba(255,255,255,.14); background:transparent; color:var(--text); cursor:pointer; }
  .rsvp .yes{ border-color: rgba(34,197,94,.45); } .rsvp .no{ border-color: rgba(239,68,68,.45); } .rsvp .maybe{ border-color: rgba(245,158,11,.45); }
  .empty{ color:var(--muted); font-style:italic; }
  .right{ margin-left:auto; }
  .bar{ height:10px; background:linear-gradient(90deg, var(--brand), var(--accent)); border-radius:999px; }
  .bar-wrap{ background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08); border-radius:999px; overflow:hidden; }
  .small{ font-size:.9rem; color:var(--muted); }
  @media (max-width: 980px){ .grid{ grid-template-columns: 1fr; } }

  .panel{
    background:
      radial-gradient(1200px 600px at 120% -10%, rgba(56,208,194,.06), transparent 60%),
      radial-gradient(800px 600px at -20% 10%, rgba(122,167,255,.06), transparent 60%),
      color-mix(in oklab, var(--surface) 92%, transparent);
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 18px;
    box-shadow: 0 14px 30px rgba(0,0,0,.28);
    padding: 1.1rem;
  }

  .section-title{
    padding: .4rem .5rem;
    border-radius: 12px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.06);
  }

  input, select{
    padding:.65rem .8rem;
    border-radius: 12px;
    transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
  }
  input:focus, select:focus{
    box-shadow: 0 0 0 3px rgba(122,167,255,.25);
    border-color: rgba(122,167,255,.55);
  }

  .button{
    transform: translateY(0);
    transition: transform .12s ease, box-shadow .15s ease, opacity .15s ease, background .2s ease;
    text-decoration:none;
  }
  .button:hover{ transform: translateY(-1px); box-shadow: 0 12px 26px rgba(0,0,0,.28); }
  .button.secondary{
    background: rgba(255,255,255,.04);
  }
  .button.secondary:hover{
    background: rgba(255,255,255,.08);
  }

  table{ border-spacing: 0 10px; }
  tbody tr{ transition: background .15s ease, transform .05s ease; }
  tbody tr:hover{ background: color-mix(in oklab, var(--elev) 96%, transparent); transform: translateY(-1px); }

  .status{ letter-spacing:.02em; }
  .paid    { box-shadow: inset 0 0 0 1px rgba(34,197,94,.35), 0 0 0 3px rgba(34,197,94,.10); }
  .partial { box-shadow: inset 0 0 0 1px rgba(245,158,11,.35), 0 0 0 3px rgba(245,158,11,.10); }
  .due     { box-shadow: inset 0 0 0 1px rgba(239,68,68,.35), 0 0 0 3px rgba(239,68,68,.10); }

  .bar-wrap{ position: relative; height:12px; }
  .bar{
    height:100%;
    border-radius:999px;
    background-image: linear-gradient(90deg, var(--brand), var(--accent));
    position: relative;
    overflow:hidden;
  }
  .bar::after{
    content:"";
    position:absolute; inset:0;
    background:
      repeating-linear-gradient(45deg, rgba(255,255,255,.12) 0 8px, transparent 8px 16px);
    animation: stripe 1.2s linear infinite;
    opacity:.35;
  }
  @keyframes stripe{ to { transform: translateX(32px); } }
  .bar[data-complete="true"]::after{ display:none; }

  .rsvp button{
    transition: background .12s ease, transform .05s ease, border-color .12s ease;
  }
  .rsvp button:hover{ transform: translateY(-1px); }

  .task{
    display:flex; align-items:center; gap:.5rem;
  }
  .task::before{
    content:"⋮⋮";
    font-weight:900; opacity:.25;
  }

  .chip{ color: color-mix(in oklab, var(--text) 80%, var(--muted)); }

  .small{ font-size:.88rem; }

  @media (max-width: 980px){
    .container{ padding: 0 .9rem; }
    .panel{ padding: .9rem; }
  }

  .event { gap: .6rem; }

  .event .stats {
    display: flex; flex-wrap: wrap; gap: .5rem;
  }
  .event .badge {
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.10);
    padding: .35rem .7rem;
    border-radius: 999px;
    font-weight: 700;
    color: var(--muted);
  }

  .attendees {
    display: grid;
    grid-template-columns: 1fr;
    gap: .45rem;
  }

  .attendee {
    display: grid;
    grid-template-columns: 1.5fr repeat(3, 108px);
    gap: .45rem;
    align-items: center;
    padding: .35rem;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 10px;
  }

  .attendee .name {
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 999px;
    padding: .35rem .7rem;
    font-weight: 700;
    color: #e6e6e6;
  }

  .attendee button {
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,.14);
    background: rgba(255,255,255,.04);
    color: var(--text);
    cursor: pointer;
    transition: background .12s ease, border-color .12s ease, transform .05s ease;
  }
  .attendee button:hover { transform: translateY(-1px); }

  .attendee .yes.active   { background: rgba(34,197,94,.16);  border-color: rgba(34,197,94,.45); }
  .attendee .maybe.active { background: rgba(245,158,11,.16); border-color: rgba(245,158,11,.45); }
  .attendee .no.active    { background: rgba(239,68,68,.16);  border-color: rgba(239,68,68,.45); }

  @media (max-width: 720px){
    .attendee { grid-template-columns: 1fr; }
    .attendee button { width: 100%; }
  }

  .drag-handle {
    cursor: grab;
    width: 32px;
    text-align: center;
    color: var(--muted);
    font-size: 1.2rem;
  }
  .member-row.dragging {
    opacity: 0.5;
    background: rgba(122,167,255,.08);
  }
  .button.danger {
    border-color: rgba(239,68,68,.45);
    color: #ef4444;
  }
  .button.danger:hover {
    background: rgba(239,68,68,.12);
  }

  .action-buttons {
    display: flex;
    gap: 0.4rem;
    justify-content: flex-end;
    align-items: center;
  }

  .row-actions {
    text-align: right;
  }

  .task {
    display: flex; justify-content: space-between; align-items: center;
  }
  .task .task-del {
    border: 1px solid rgba(239,68,68,.45);
    color: #ef4444;
    background: transparent;
    border-radius: 8px;
    padding: .25rem .45rem;
    cursor: pointer;
    opacity: .9;
    transition: background .12s ease, opacity .12s ease, transform .05s ease;
  }
  .task .task-del:hover {
    background: rgba(239,68,68,.12);
    transform: translateY(-1px);
  }
  footer{ padding:1.4rem 0 1.6rem; color:var(--muted); border-top:1px solid rgba(255,255,255,.06); text-align:center;}
`;

type Member = {
  id: string;
  name: string;
  role: string;
  dues: number;
  paid: number;
};

type EventItem = {
  id: string;
  title: string;
  date: string;
  yes: string[];
  no: string[];
  maybe: string[];
};

type TaskItem = {
  id: string;
  title: string;
  assignee: string;
  col: "todo" | "doing" | "done";
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function today(offset = 0) {
  const d = new Date(Date.now() + offset * 86400000);
  return d.toISOString().slice(0, 10);
}

function fmtDate(s: string) {
  if (!s) return "—";
  const d = new Date(`${s}T00:00:00`);
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const seedMembers: Member[] = [
  { id: uid(), name: "Bob Smith", role: "Secretary", dues: 300, paid: 0 },
  { id: uid(), name: "John Doe", role: "Treasurer", dues: 300, paid: 150 },
  { id: uid(), name: "RJ Edwards", role: "President", dues: 300, paid: 300 },
];

const seedEvents: EventItem[] = [
  { id: uid(), title: "Chapter Meeting", date: today(3), yes: [], no: [], maybe: [] },
  { id: uid(), title: "Philanthropy Night", date: today(10), yes: [], no: [], maybe: [] },
];

const seedTasks: TaskItem[] = [
  { id: uid(), title: "Book room for meeting", assignee: "Bob Smith", col: "done" },
  { id: uid(), title: "Collect remaining dues", assignee: "John Doe", col: "doing" },
  { id: uid(), title: "Publish event agenda", assignee: "RJ Edwards", col: "todo" },
];

export default function ChapterOpsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [draggedMemberId, setDraggedMemberId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem("members");
      const savedEvents = localStorage.getItem("events");
      const savedTasks = localStorage.getItem("tasks");

      const initialMembers = savedMembers ? (JSON.parse(savedMembers) as Member[]) : seedMembers;
      const initialEvents = savedEvents ? (JSON.parse(savedEvents) as EventItem[]) : seedEvents;
      const initialTasks = savedTasks ? (JSON.parse(savedTasks) as TaskItem[]) : seedTasks;

      setMembers(initialMembers);
      setEvents(initialEvents);
      setTasks(initialTasks);
      setTaskAssignee(initialMembers[0]?.name || "");
    } catch {
      setMembers(seedMembers);
      setEvents(seedEvents);
      setTasks(seedTasks);
      setTaskAssignee(seedMembers[0]?.name || "");
    }
  }, []);

  useEffect(() => {
    if (members.length) localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    if (events.length || localStorage.getItem("events")) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    if (tasks.length || localStorage.getItem("tasks")) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (e.key === "/" && tag !== "input" && tag !== "textarea") {
        e.preventDefault();
        const searchInput = document.getElementById("search");
        searchInput?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = window.setTimeout(() => setToastMsg(""), 1750);
    return () => window.clearTimeout(timer);
  }, [toastMsg]);

  const filteredMembers = useMemo(() => {
    const q = search.toLowerCase();
    return [...members]
      .filter((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
      .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  }, [members, search, sortAsc]);

  const totals = useMemo(() => {
    let totalDues = 0;
    let totalPaid = 0;
    let countPaid = 0;
    let countPartial = 0;
    let countDue = 0;

    filteredMembers.forEach((m) => {
      totalDues += m.dues;
      totalPaid += m.paid;
      if (m.paid >= m.dues) countPaid++;
      else if (m.paid > 0) countPartial++;
      else countDue++;
    });

    const pct = totalDues ? Math.round((totalPaid / totalDues) * 100) : 0;

    return { totalDues, totalPaid, countPaid, countPartial, countDue, pct };
  }, [filteredMembers]);

  function showToast(msg: string) {
    setToastMsg(msg);
  }

  function statusClass(m: Member) {
    if (m.paid >= m.dues) return "status paid";
    if (m.paid > 0) return "status partial";
    return "status due";
  }

  function statusText(m: Member) {
    if (m.paid >= m.dues) return "Paid";
    if (m.paid > 0) return "Partial";
    return "Due";
  }

  function togglePaid(id: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, paid: m.paid < m.dues ? m.dues : 0 } : m))
    );
  }

  function addMember() {
    const name = window.prompt("Member name");
    if (!name) return;
    const role = window.prompt("Role (e.g., Member, Treasurer)") || "Member";
    const dues = parseInt(window.prompt("Dues amount (e.g., 300)") || "300", 10) || 300;
    const next = { id: uid(), name, role, dues, paid: 0 };
    setMembers((prev) => [...prev, next]);
    if (!taskAssignee) setTaskAssignee(name);
    showToast("Member added");
  }

  function removeMember(id: string) {
    if (!window.confirm("Remove this member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setEvents((prev) =>
      prev.map((ev) => ({
        ...ev,
        yes: ev.yes.filter((x) => x !== id),
        maybe: ev.maybe.filter((x) => x !== id),
        no: ev.no.filter((x) => x !== id),
      }))
    );
  }

  function exportMembersCsv() {
    const rows: (string | number)[][] = [["Name", "Role", "Dues", "Paid", "Status"]];
    members.forEach((m) => {
      rows.push([m.name, m.role, m.dues, m.paid, statusText(m)]);
    });
    downloadCsv("members.csv", rows);
    showToast("CSV exported");
  }

  function addEvent() {
    const title = eventTitle.trim();
    const date = eventDate || today(7);
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    setEvents((prev) => [...prev, { id: uid(), title, date, yes: [], no: [], maybe: [] }]);
    setEventTitle("");
    showToast("Event created");
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function updateRsvp(eventId: string, memberId: string, value: "yes" | "maybe" | "no") {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          yes: value === "yes" ? [...ev.yes.filter((x) => x !== memberId), memberId] : ev.yes.filter((x) => x !== memberId),
          maybe: value === "maybe" ? [...ev.maybe.filter((x) => x !== memberId), memberId] : ev.maybe.filter((x) => x !== memberId),
          no: value === "no" ? [...ev.no.filter((x) => x !== memberId), memberId] : ev.no.filter((x) => x !== memberId),
        };
      })
    );
  }

  function addTask() {
    const title = taskTitle.trim();
    if (!title) return;
    setTasks((prev) => [...prev, { id: uid(), title, assignee: taskAssignee || "Unassigned", col: "todo" }]);
    setTaskTitle("");
    showToast("Task added");
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function dropTask(col: TaskItem["col"]) {
    if (!draggedTaskId) return;
    setTasks((prev) => prev.map((t) => (t.id === draggedTaskId ? { ...t, col } : t)));
    setDraggedTaskId(null);
  }

  function clearDone() {
    const hadDone = tasks.some((t) => t.col === "done");
    if (!hadDone) return;
    if (!window.confirm("Remove all tasks in Done?")) return;
    setTasks((prev) => prev.filter((t) => t.col !== "done"));
  }

  function handleMemberDrop(targetId: string | null) {
    if (!draggedMemberId) return;

    setMembers((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((m) => m.id === draggedMemberId);
      if (fromIndex === -1) return prev;

      const [moved] = next.splice(fromIndex, 1);

      if (targetId === null) {
        next.push(moved);
      } else {
        const toIndex = next.findIndex((m) => m.id === targetId);
        if (toIndex === -1) next.push(moved);
        else next.splice(toIndex, 0, moved);
      }

      return next;
    });

    setDraggedMemberId(null);
  }

  const todoTasks = tasks.filter((t) => t.col === "todo");
  const doingTasks = tasks.filter((t) => t.col === "doing");
  const doneTasks = tasks.filter((t) => t.col === "done");

  return (
    <>
      <style>{CHAPTER_OPS_STYLES}</style>

      <header>
        <div className="container nav">
          <div className="brand">
            <span className="logo">RJ</span>
            <span>RJ Edwards</span>
          </div>
          <Link className="button secondary" href="/projects">
            ← Back to Portfolio
          </Link>
        </div>
      </header>

      <main>
        <div className="container">
          <h1>Chapter Operations Dashboard v1.0</h1>

          <div className="grid">
            <section className="panel">
              <div className="section-title">
                <strong>Members</strong>
                <div className="row right">
                  <input
                    id="search"
                    placeholder="Search name or role"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="button secondary" onClick={addMember}>
                    Add
                  </button>
                  <button className="button secondary" onClick={exportMembersCsv}>
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="totals">
                <span className="pill">
                  Total dues: <strong>${totals.totalDues}</strong>
                </span>
                <span className="pill">
                  Collected: <strong>${totals.totalPaid}</strong> ({totals.pct}%)
                </span>
                <span className="pill">
                  Paid: <strong>{totals.countPaid}</strong>
                </span>
                <span className="pill">
                  Partial: <strong>{totals.countPartial}</strong>
                </span>
                <span className="pill">
                  Due: <strong>{totals.countDue}</strong>
                </span>
                <div className="bar-wrap" style={{ flex: 1, minWidth: 180 }}>
                  <div
                    className="bar"
                    style={{ width: `${totals.pct}%` }}
                    data-complete={totals.pct >= 100 ? "true" : undefined}
                  />
                </div>
              </div>

              <table aria-label="Members table">
                <thead>
                  <tr>
                    <th />
                    <th>
                      <button
                        className="button secondary"
                        title="Sort by name"
                        onClick={() => setSortAsc((prev) => !prev)}
                      >
                        Name
                      </button>
                    </th>
                    <th>Role</th>
                    <th>Dues</th>
                    <th>Status</th>
                    <th>Paid?</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr
                      key={m.id}
                      className={`member-row${draggedMemberId === m.id ? " dragging" : ""}`}
                      draggable
                      onDragStart={() => setDraggedMemberId(m.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleMemberDrop(m.id)}
                    >
                      <td className="drag-handle" title="Drag to reorder">
                        ☰
                      </td>
                      <td>
                        <strong>{m.name}</strong>
                      </td>
                      <td>{m.role}</td>
                      <td>${m.dues}</td>
                      <td>
                        <span className={statusClass(m)}>{statusText(m)}</span>
                      </td>
                      <td className="row-actions">
                        <div className="action-buttons">
                          <button className="button secondary" onClick={() => togglePaid(m.id)}>
                            {m.paid >= m.dues ? "Mark Unpaid" : "Mark Paid"}
                          </button>
                          <button className="button secondary danger" onClick={() => removeMember(m.id)}>
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div onDragOver={(e) => e.preventDefault()} onDrop={() => handleMemberDrop(null)} />
            </section>

            <section className="panel">
              <div className="section-title">
                <strong>Events</strong>
                <div className="row right">
                  <input
                    placeholder="Event title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  <button className="button secondary" onClick={addEvent}>
                    Create
                  </button>
                </div>
              </div>

              <div>
                {!events.length ? (
                  <div className="empty">No events yet.</div>
                ) : (
                  [...events]
                    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
                    .map((ev) => {
                      const total = members.length || 1;
                      const yes = ev.yes.length;
                      const maybe = ev.maybe.length;
                      const no = ev.no.length;
                      const pct = Math.round((yes / total) * 100);

                      return (
                        <div className="event" key={ev.id}>
                          <div className="row" style={{ justifyContent: "space-between" }}>
                            <div>
                              <strong>{ev.title}</strong>
                              <br />
                              <small>{fmtDate(ev.date)}</small>
                            </div>
                            <button className="button secondary" onClick={() => deleteEvent(ev.id)}>
                              Delete
                            </button>
                          </div>

                          <div className="stats">
                            <span className="badge">Yes: {yes}</span>
                            <span className="badge">Maybe: {maybe}</span>
                            <span className="badge">No: {no}</span>
                            <span className="badge">Attending: {pct}%</span>
                          </div>

                          <div className="attendees">
                            {members.map((m) => {
                              const yesActive = ev.yes.includes(m.id);
                              const maybeActive = ev.maybe.includes(m.id);
                              const noActive = ev.no.includes(m.id);

                              return (
                                <div className="attendee" key={`${ev.id}-${m.id}`}>
                                  <span className="name">{m.name}</span>
                                  <button
                                    className={`yes ${yesActive ? "active" : ""}`}
                                    onClick={() => updateRsvp(ev.id, m.id, "yes")}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className={`maybe ${maybeActive ? "active" : ""}`}
                                    onClick={() => updateRsvp(ev.id, m.id, "maybe")}
                                  >
                                    Maybe
                                  </button>
                                  <button
                                    className={`no ${noActive ? "active" : ""}`}
                                    onClick={() => updateRsvp(ev.id, m.id, "no")}
                                  >
                                    No
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,.08)",
                  margin: "1rem 0",
                }}
              />

              <div className="section-title">
                <strong>Tasks</strong>
                <div className="row right">
                  <input
                    placeholder="New task"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                  <select value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)}>
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <button className="button secondary" onClick={addTask}>
                    Add
                  </button>
                  <button className="button secondary" onClick={clearDone}>
                    Clear Done
                  </button>
                </div>
              </div>

              <div className="kanban">
                <div
                  className="col"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropTask("todo")}
                >
                  <strong>Todo</strong>
                  <div>
                    {todoTasks.map((task) => (
                      <div
                        key={task.id}
                        className="task"
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                      >
                        <div>
                          {task.title} — {task.assignee}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="col"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropTask("doing")}
                >
                  <strong>Doing</strong>
                  <div>
                    {doingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="task"
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                      >
                        <div>
                          {task.title} — {task.assignee}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="col"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropTask("done")}
                >
                  <strong>Done</strong>
                  <div>
                    {doneTasks.map((task) => (
                      <div
                        key={task.id}
                        className="task"
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                      >
                        <div>
                          {task.title} — {task.assignee}
                        </div>
                        <button className="task-del" onClick={() => deleteTask(task.id)} title="Remove task">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer>© {year} RJ Edwards. All rights reserved.</footer>

      {toastMsg ? (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "28px",
            transform: "translateX(-50%)",
            background: "rgba(17,19,26,.95)",
            color: "#e6e6e6",
            padding: ".6rem .9rem",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "0 10px 24px rgba(0,0,0,.35)",
            zIndex: 9999,
          }}
        >
          {toastMsg}
        </div>
      ) : null}
    </>
  );
}