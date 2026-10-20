import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  // Interactive cards contain a CardLink covering the whole card; hover, focus
  // and pressed states show on the card itself.
  interactive?: boolean;
  padded?: boolean;
  className?: string;
  children: ReactNode;
};

const interactiveClass =
  "group relative hover:border-ink has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-2 has-[[data-card-link]:focus-visible]:outline-board has-[[data-card-link]:active]:bg-canvas";

export function Card({ interactive = false, padded = true, className = "", children }: CardProps) {
  return (
    <div
      className={`rounded border border-line bg-surface ${padded ? "p-4" : ""} ${interactive ? interactiveClass : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// The card's main link. Its ::after stretches over the whole card, so the card is
// one big hit area without wrapping it in a link. A second link inside the card
// needs "relative z-20" to sit above this one.
export function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      data-card-link
      className="focus-visible:outline-none after:absolute after:inset-0 after:z-10 after:content-['']"
    >
      {children}
    </Link>
  );
}
