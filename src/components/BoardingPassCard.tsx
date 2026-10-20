import { Card } from "./Card";
import { NewBadge } from "./NewBadge";

type BoardingPassCardProps = {
  name: string;
  packed: number;
  total: number;
  lastPackedAt: string | null;
  newCount?: number;
  href?: string;
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const FILLER_WORDS = new Set(["A", "AN", "AND", "AT", "FOR", "IN", "OF", "ON", "THE", "TO"]);

// "Beach weekend" → "BEW", "Weekend at parents'" → "WEP", "Lisbon" → "LIS".
export function tripCode(name: string) {
  const words = name
    .normalize("NFD")
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const kept = words.filter((word) => !FILLER_WORDS.has(word));
  const w = kept.length > 0 ? kept : words;
  const code =
    w.length >= 3
      ? w.slice(0, 3).map((word) => word[0]).join("")
      : w.length === 2
        ? w[0].slice(0, 2) + w[1][0]
        : (w[0] ?? "").slice(0, 3);
  return code.padEnd(3, "X");
}

// "12 OCT". Only called after mount, so the user's time zone is safe to use.
function formatDay(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

// Half-circle notches: a circle in the page color with two border sides colored,
// rotated 45° so the colored half faces into the card. Sides swap at @md, when the
// tear line turns vertical.
const notch = "absolute size-5 rotate-45 rounded-full border border-transparent bg-canvas";
const notchStart =
  "-left-px top-0 -translate-x-1/2 -translate-y-1/2 border-t-current border-r-current @md:left-0 @md:-top-px @md:border-t-transparent @md:border-b-current";
const notchEnd =
  "-right-px top-0 translate-x-1/2 -translate-y-1/2 border-b-current border-l-current @md:right-auto @md:left-0 @md:top-auto @md:-bottom-px @md:-translate-x-1/2 @md:translate-y-1/2 @md:border-b-transparent @md:border-t-current";

export function BoardingPassCard({ name, packed, total, lastPackedAt, newCount = 0, href }: BoardingPassCardProps) {
  const notchColor = href ? "text-line group-hover:text-ink" : "text-line";
  return (
    <Card href={href} padded={false} className="@container">
      <div className="relative flex flex-col @md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-4 @md:p-5">
          <span aria-hidden="true" className="font-mono text-3xl leading-none tracking-widest text-ink">
            {tripCode(name)}
          </span>
          <h2 className="font-display text-2xl leading-tight font-semibold uppercase tracking-wide break-words text-ink">
            {name}
          </h2>
          {newCount > 0 && (
            <span>
              <NewBadge>{`${newCount} new`}</NewBadge>
            </span>
          )}
        </div>

        <div aria-hidden="true" className={`relative h-0 @md:h-auto @md:w-0 ${notchColor}`}>
          <div className="absolute inset-x-5 top-0 border-t border-dashed border-line @md:inset-x-auto @md:inset-y-5 @md:left-0 @md:border-t-0 @md:border-l" />
          <span className={`${notch} ${notchStart}`} />
          <span className={`${notch} ${notchEnd}`} />
        </div>

        <div className="flex flex-col justify-center gap-1 p-4 font-mono text-xs uppercase tracking-wider @md:w-52 @md:p-5">
          <p className="text-ink">
            <span aria-hidden="true" className="text-base">
              {packed}/{total} packed
            </span>
            <span className="sr-only">
              {packed} of {total} packed
            </span>
          </p>
          <p className="text-muted">{lastPackedAt ? `Last packed ${formatDay(lastPackedAt)}` : "Not packed yet"}</p>
        </div>
      </div>
    </Card>
  );
}
