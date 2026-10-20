import Link from "next/link";
import type { ReactNode } from "react";
import { MAX_TRIP_NAME, type TripNameProblem } from "@/lib/trips";

// What to do next when a trip name can't be used. Shared by New trip and Rename.
export function tripNameMessage(problem: TripNameProblem): ReactNode {
  if (problem.kind === "empty") return "Enter a name, like ‘Beach weekend’";
  if (problem.kind === "long") return `Keep it under ${MAX_TRIP_NAME} characters`;
  return (
    <span>
      You already have a trip called ‘{problem.trip.name}’.{" "}
      {/* An invisible ::after makes the tap target 44px tall; the focus ring stays on the text. */}
      <Link
        href={`/trips/${problem.trip.id}`}
        className="relative rounded underline underline-offset-4 after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] hover:decoration-2"
      >
        Open it
      </Link>{" "}
      or choose another name
    </span>
  );
}
