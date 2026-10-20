import type { ReactNode } from "react";
import { PlaneIcon } from "@/components/PlaneIcon";
import { RunwayProgress } from "@/components/RunwayProgress";

type ProgressBarProps = {
  packed: number;
  total: number;
  countId: string;
  allPacked: boolean;
  // Latest change ("Added Hat to Clothes"), shown on screen and read politely.
  message: ReactNode;
};

// Sticks to the top while the list scrolls, so the count and the All packed message
// are on screen when the last item is ticked, wherever it is.
export function ProgressBar({ packed, total, countId, allPacked, message }: ProgressBarProps) {
  return (
    // Live regions stay rendered even when empty; their content adds the spacing.
    <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-canvas px-4 py-3 sm:-mx-6 sm:px-6">
      <RunwayProgress packed={packed} total={total} countId={countId} />
      {/* Always rendered, so the message is announced when it appears. In the page, not a modal. */}
      <div role="status">
        {allPacked && (
          <p className="mt-2 flex items-center gap-2 font-semibold text-ink">
            {/* The plane, not a tick: a filled tick box read like a checkbox. */}
            <PlaneIcon className="size-5 shrink-0" />
            All packed. Have a good trip.
          </p>
        )}
      </div>
      <div aria-live="polite">{message && <div className="mt-2 flex flex-wrap items-center gap-x-3 text-ink">{message}</div>}</div>
    </div>
  );
}
