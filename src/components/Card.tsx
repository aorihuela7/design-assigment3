import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  // With href the whole card is a link, with hover and pressed states.
  href?: string;
  padded?: boolean;
  className?: string;
  children: ReactNode;
};

export function Card({ href, padded = true, className = "", children }: CardProps) {
  const base = `group block rounded border border-line bg-surface ${padded ? "p-4" : ""} ${className}`;
  if (!href) return <div className={base}>{children}</div>;
  return (
    <Link href={href} className={`${base} hover:border-ink active:bg-canvas`}>
      {children}
    </Link>
  );
}
