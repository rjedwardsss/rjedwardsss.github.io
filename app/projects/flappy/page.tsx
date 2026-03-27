import FlappyClient from "./FlappyClient";

export const metadata = {
  title: "Flappy Bird — Neuro-evolution • RJ Edwards",
  description: "Playable Flappy Bird neuro-evolution demo with evolving neural nets (JS only).",
  robots: {
    index: true,
    follow: true,
  },
};
export default function FlappyPage() {
  return <FlappyClient />;
}