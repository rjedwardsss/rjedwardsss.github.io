import Link from "next/link";

type NavbarProps = {
  backHref?: string;
  backLabel?: string;
};

export default function Navbar({
  backHref = "/",
  backLabel = "← Back",
}: NavbarProps) {
  return (
    <header>
      <div className="container nav">
        <div className="brand">
          <span className="logo">RJ</span>
          <span>RJ Edwards</span>
        </div>
        <Link className="button secondary" href={backHref}>
          {backLabel}
        </Link>
      </div>
    </header>
  );
}