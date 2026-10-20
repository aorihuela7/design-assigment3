import { Card } from "@/components/Card";
import { Page } from "@/components/Page";

export const BACK_TO_MY_TRIPS = { href: "/", label: "Back to My trips" };

// Used as the Suspense fallback on the server and as the first client render,
// so both are identical and hydration matches.
export function ListLoading() {
  return (
    <Page title="Packing list" back={BACK_TO_MY_TRIPS}>
      <p role="status" className="text-muted">
        Loading your list…
      </p>
      <div aria-hidden="true">
        <Card padded={false}>
          <ul className="divide-y divide-line">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex min-h-11 items-center gap-3 px-4 py-2">
                <span className="size-6 rounded border-2 border-line" />
                <span className="h-4 w-40 max-w-full rounded bg-canvas" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Page>
  );
}
