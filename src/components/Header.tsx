import Link from "next/link";

type HeaderProps = {
  // Current page name, shown large on the board and used as the page's h1.
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header data-surface="board" className="bg-board text-amber">
      <div className="mx-auto w-full max-w-3xl px-4 pt-3 pb-5 sm:px-6">
        <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest">
          <Link
            href="/"
            className="-mx-1 inline-flex min-h-11 items-center rounded px-1 underline-offset-4 hover:underline active:bg-amber active:text-board"
          >
            Pack Again
          </Link>
          <span aria-hidden="true">Departures</span>
        </div>
        <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide sm:text-5xl">
          {title}
        </h1>
      </div>
    </header>
  );
}
