import Link from "next/link";

type HeaderProps = {
  // Current page name, shown large on the board and used as the page's h1.
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header data-surface="board" className="bg-board text-amber">
      <div className="mx-auto w-full max-w-225 px-4 pt-3 pb-5 sm:px-6">
        <div className="flex items-center font-mono text-xs uppercase tracking-widest">
          <Link
            href="/"
            className="-mx-1 inline-flex min-h-11 shrink-0 items-center rounded px-1 underline-offset-4 hover:underline active:bg-amber active:text-board"
          >
            Pack Again
          </Link>
        </div>
        <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide wrap-anywhere sm:text-5xl">
          {title}
        </h1>
      </div>
    </header>
  );
}
