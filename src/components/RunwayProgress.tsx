type RunwayProgressProps = {
  packed: number;
  total: number;
  // Lets a page move focus to the count, e.g. after clearing ticks.
  countId?: string;
};

const PLANE_SIZE = 24;

export function RunwayProgress({ packed, total, countId }: RunwayProgressProps) {
  const percent = total > 0 ? Math.min(100, Math.max(0, (packed / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      {/* Decorative: the count beside it carries the information. */}
      <div aria-hidden="true" className="relative h-6 min-w-12 flex-1">
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-muted" />
        <svg
          viewBox="0 0 24 24"
          className="absolute top-1/2 size-6 -translate-y-1/2 text-ink transition-[left] duration-500 ease-out motion-reduce:transition-none"
          // Keeps the plane inside the runway at 0% and 100%.
          style={{ left: `calc(${percent}% - ${(percent / 100) * PLANE_SIZE}px)` }}
        >
          <path
            fill="currentColor"
            d="M22.5 12c0-.8-.7-1.3-1.5-1.3h-5.6L9.8 3H7.6l2.9 7.7H5.3L3.5 8.2H2l.9 3.8L2 15.8h1.5l1.8-2.5h5.2L7.6 21h2.2l5.6-7.7H21c.8 0 1.5-.5 1.5-1.3z"
          />
        </svg>
      </div>
      <p
        id={countId}
        tabIndex={countId ? -1 : undefined}
        className="rounded font-mono text-xs whitespace-nowrap uppercase tracking-wider text-ink"
      >
        {packed} of {total} packed
      </p>
    </div>
  );
}
