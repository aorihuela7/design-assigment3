"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/Field";
import { Page } from "@/components/Page";
import { StorageNotice } from "@/components/StorageNotice";
import { createStarterTrips } from "@/lib/starters";
import { createId, createIfMissing, saveData, useStorage } from "@/lib/storage";
import { cleanName, MAX_TRIP_NAME, tripNameProblem, type TripNameProblem } from "@/lib/trips";

function message(problem: TripNameProblem): ReactNode {
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

export function NewTrip() {
  const router = useRouter();
  const storage = useStorage();
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // No errors before the first submit; after it, the error follows what's typed.
  const [attempted, setAttempted] = useState(false);

  // Arriving here first still counts as a first visit: the starter lists come too.
  useEffect(() => {
    createIfMissing(createStarterTrips);
  }, []);

  const problem = storage.status === "ready" ? storage.problem : null;
  const trips = storage.status === "ready" ? (storage.data?.trips ?? []) : [];
  const nameProblem = attempted ? tripNameProblem(name, trips) : null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (storage.status !== "ready" || !storage.data) return;
    if (tripNameProblem(name, storage.data.trips)) {
      setAttempted(true); // keeps exactly what was typed
      inputRef.current?.focus();
      return;
    }
    const clean = cleanName(name);
    const id = createId();
    const trip = { id, name: clean, items: [], lastPackedAt: null, promptDismissedAt: null, ticksClearedAt: null, updatedAt: new Date().toISOString() };
    saveData({ ...storage.data, trips: [...storage.data.trips, trip] });
    // The empty list focuses its Add item field.
    router.push(`/trips/${id}`);
  }

  return (
    <Page title="New trip" back={{ href: "/", label: "Back to My trips" }}>
      <StorageNotice problem={problem} />
      {/* Data from a newer version must not be written over. */}
      {problem !== "newer" && (
        <Card>
          <form noValidate onSubmit={submit} className="flex flex-col gap-4">
            <TextField
              ref={inputRef}
              label="Trip name"
              error={nameProblem ? message(nameProblem) : undefined}
              placeholder="e.g. Beach weekend"
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" variant="primary">
                Create trip
              </Button>
              <ButtonLink href="/">Cancel</ButtonLink>
            </div>
          </form>
        </Card>
      )}
    </Page>
  );
}
