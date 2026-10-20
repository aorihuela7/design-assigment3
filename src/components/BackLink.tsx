import Link from "next/link";

type BackLinkProps = {
  href: string;
  children: string;
};

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded font-mono text-sm uppercase tracking-wider text-ink underline-offset-4 hover:underline active:text-muted"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4">
        <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      {children}
    </Link>
  );
}
