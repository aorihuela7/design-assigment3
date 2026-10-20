import { Card, CardLink } from "./Card";
import { NewBadge } from "./NewBadge";
import { RunwayProgress } from "./RunwayProgress";

type BoardingPassCardProps = {
  name: string;
  code: string; // from uniqueCodes(), so it's unique among the person's lists
  packed: number;
  total: number;
  lastPackedAt: string | null;
  newCount?: number;
  // The list name links here; the link's hit area covers the whole card.
  href?: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "12 Oct". Only called after mount, so the user's time zone is safe to use.
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

export function BoardingPassCard({ name, code, packed, total, lastPackedAt, newCount = 0, href }: BoardingPassCardProps) {
  return (
    <Card interactive={Boolean(href)} padded={false} className="@container">
      <div className="relative flex flex-col @md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-4 @md:p-5">
          <span aria-hidden="true" className="font-mono text-3xl leading-none tracking-widest text-ink">
            {code}
          </span>
          <h2 className="font-display text-2xl leading-tight font-semibold uppercase tracking-wide break-words text-ink">
            {href ? <CardLink href={href}>{name}</CardLink> : name}
          </h2>
          {newCount > 0 && (
            <span>
              <NewBadge>{`${newCount} new`}</NewBadge>
            </span>
          )}
        </div>

        <div
          aria-hidden="true"
          className={`pointer-events-none relative h-0 @md:h-auto @md:w-0 ${href ? "text-line group-hover:text-ink" : "text-line"}`}
        >
          <div className="absolute inset-x-5 top-0 border-t border-dashed border-line @md:inset-x-auto @md:inset-y-5 @md:left-0 @md:border-t-0 @md:border-l" />
          <span className={`${notch} ${notchStart}`} />
          <span className={`${notch} ${notchEnd}`} />
        </div>

        <div className="flex flex-col justify-center gap-2 p-4 @md:w-64 @md:p-5">
          <RunwayProgress packed={packed} total={total} />
          {lastPackedAt && (
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
              Last packed {formatDay(lastPackedAt)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
