"use client";

import { useEffect } from "react";
import { BoardingPassCard } from "@/components/BoardingPassCard";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { Page } from "@/components/Page";
import { StorageNotice } from "@/components/StorageNotice";
import { uniqueCodes } from "@/lib/codes";
import { createStarterTrips, isUntouchedStarters } from "@/lib/starters";
import { createIfMissing, saveData, useStorage, type StoredData, type Trip } from "@/lib/storage";

function newestFirst(a: Trip, b: Trip) {
  return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
}

function addStartersBack(data: StoredData) {
  saveData({ ...data, trips: createStarterTrips() });
  // The button is gone now; move focus to the first list instead of losing it.
  requestAnimationFrame(() => document.querySelector<HTMLElement>("[data-card-link]")?.focus());
}

// Same on the server and the first client render, so hydration matches.
function Loading() {
  return (
    <>
      <p role="status" className="-mt-2 text-muted">
        Loading your lists…
      </p>
      <ul aria-hidden="true" className="flex flex-col gap-8">
        {[0, 1, 2].map((i) => (
          <li key={i}>
            <Card className="flex flex-col gap-3">
              <span className="h-7 w-16 rounded bg-canvas" />
              <span className="h-6 w-48 max-w-full rounded bg-canvas" />
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}

export function MyTrips() {
  const storage = useStorage();

  // First visit: the lists are there right away, nothing asked first.
  useEffect(() => {
    createIfMissing(createStarterTrips);
  }, []);

  // Saved by a newer version of the app: show nothing that could write over it.
  if (storage.status === "ready" && storage.problem === "newer") {
    return (
      <Page title="My trips">
        <StorageNotice problem="newer" />
      </Page>
    );
  }

  // Also covers the moment before the starter lists are created.
  if (storage.status === "loading" || storage.data === null) {
    return (
      <Page title="My trips">
        <Loading />
      </Page>
    );
  }

  const { data } = storage;
  const { trips } = data;
  // Codes come from storage order, so they stay put when the sort changes.
  const codes = uniqueCodes(trips);

  return (
    <Page title="My trips">
      <StorageNotice problem={storage.problem} />

      {trips.length === 0 ? (
        // Only after the person deleted every list; starters never come back on their own.
        <Card className="flex flex-col gap-4">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-wide">No lists yet</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink variant="primary" href="/trips/new">
              New trip type
            </ButtonLink>
            <Button onClick={() => addStartersBack(data)}>Add the starter lists back</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* The primary action stays at the top, beside the intro on wide screens. */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            {isUntouchedStarters(trips) && <p className="text-muted">Starter lists. Open one, make it yours.</p>}
            <ButtonLink variant="primary" href="/trips/new" className="sm:ml-auto">
              New trip type
            </ButtonLink>
          </div>

          {/* 32px: notches stick out 10px on each side, so they never meet. */}
          <ul className="flex flex-col gap-8">
            {[...trips].sort(newestFirst).map((trip) => (
              <li key={trip.id}>
                <BoardingPassCard
                  name={trip.name}
                  code={codes.get(trip.id) ?? ""}
                  packed={trip.items.filter((item) => item.packed).length}
                  total={trip.items.length}
                  lastPackedAt={trip.lastPackedAt}
                  newCount={trip.items.filter((item) => item.isNew).length}
                  href={`/trips/${trip.id}`}
                  forgotHref={`/trips/${trip.id}?add=1`}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {storage.problem !== "blocked" && <p className="mt-auto text-sm text-muted">Saved on this device.</p>}
    </Page>
  );
}
