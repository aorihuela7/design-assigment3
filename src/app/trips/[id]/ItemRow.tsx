import { Button } from "@/components/Button";
import { NewBadge } from "@/components/NewBadge";
import type { Item } from "@/lib/storage";

type ItemRowProps = {
  item: Item;
  onToggle: () => void;
  onRemove: () => void;
  // Just added or restored: plays the arrive highlight once.
  arrived?: boolean;
};

// The whole row is the checkbox's label, so the hit area is at least 44px high.
export function ItemRow({ item, onToggle, onRemove, arrived = false }: ItemRowProps) {
  return (
    <li className={`flex items-center gap-2 px-2 ${arrived ? "motion-safe:animate-arrive" : ""}`}>
      <label className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded px-2 py-2 hover:bg-canvas">
        <span className="relative flex size-6 shrink-0">
          <input
            id={`item-${item.id}`}
            type="checkbox"
            checked={item.packed}
            onChange={onToggle}
            className="peer size-6 cursor-pointer appearance-none rounded border-2 border-ink bg-surface checked:bg-ink"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none absolute inset-0 m-auto hidden size-4 text-surface peer-checked:block"
          >
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </span>
        {/* Packed: checkmark, strike-through and hidden text, never color alone. */}
        <span className={`min-w-0 flex-1 wrap-anywhere ${item.packed ? "text-muted line-through" : "text-ink"}`}>
          {item.name}
          {item.packed && <span className="sr-only"> Packed</span>}
        </span>
        {item.isNew && <NewBadge />}
      </label>
      {/* Always visible, never only on hover. Removing is immediate. */}
      <Button variant="quiet" aria-label={`Remove ${item.name}`} onClick={onRemove} className="shrink-0">
        Remove
      </Button>
    </li>
  );
}

export const UNDO_ROW_ID = "undo-removed-item";

// Takes the removed item's place until the next change to the list, so Undo is
// right where the item was, for pointer and keyboard alike.
export function RemovedRow({ name, onUndo }: { name: string; onUndo: () => void }) {
  return (
    <li className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1 text-muted">
      <span className="min-w-0 wrap-anywhere">Removed {name}</span>
      <span aria-hidden="true">·</span>
      <Button id={UNDO_ROW_ID} aria-label={`Undo removing ${name}`} onClick={onUndo}>
        Undo
      </Button>
    </li>
  );
}
