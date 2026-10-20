import type { ReactNode } from "react";
import { MAX_TRIP_NAME, type TripNameProblem } from "@/lib/trips";
import { TextLink } from "./TextLink";

// What to do next when a trip name can't be used. Shared by New trip and Rename.
export function tripNameMessage(problem: TripNameProblem): ReactNode {
  if (problem.kind === "empty") return "Enter a name, like ‘Beach weekend’";
  if (problem.kind === "long") return `Keep it under ${MAX_TRIP_NAME} characters`;
  return (
    <span>
      You already have a trip called ‘{problem.trip.name}’.{" "}
      <TextLink href={`/trips/${problem.trip.id}`} inline>
        Open it
      </TextLink>{" "}
      or choose another name
    </span>
  );
}
