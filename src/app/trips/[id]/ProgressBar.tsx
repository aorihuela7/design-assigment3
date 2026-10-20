import type { ReactNode } from "react";
import { RunwayProgress } from "@/components/RunwayProgress";

type ProgressBarProps = {
  packed: number;
  total: number;
  countId: string;
  allPacked: boolean;
  children?: ReactNode;
};

// Sticks to the top while the list scrolls, so the count and the All packed message
// are on screen when the last item is ticked, wherever it is.
export function ProgressBar({ packed, total, countId, allPacked, children }: ProgressBarProps) {
  return (
    <div className="sticky top-0 z-30 -mx-4 flex flex-col gap-2 border-b border-line bg-canvas px-4 py-3 sm:-mx-6 sm:px-6">
      <RunwayProgress packed={packed} total={total} countId={countId} />
      {/* Always rendered, so the message is announced when it appears. In the page, not a modal. */}
      <div role="status">
        {allPacked && (
          <p className="flex items-center gap-2 font-semibold text-ink">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-5 shrink-0">
              <rect x="1" y="1" width="14" height="14" rx="2" fill="currentColor" />
              <path d="M4 8.5l2.5 2.5L12 5.5" fill="none" stroke="var(--color-surface)" strokeWidth="2" />
            </svg>
            All packed. Have a good trip.
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
