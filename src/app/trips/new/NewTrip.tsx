"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/Field";
import { Page } from "@/components/Page";
import { StorageNotice } from "@/components/StorageNotice";
import { createStarterTrips } from "@/lib/starters";
import { createId, createIfMissing, saveData, useStorage } from "@/lib/storage";
import { cleanName } from "@/lib/trips";

export function NewTrip() {
  const router = useRouter();
  const storage = useStorage();
  const [name, setName] = useState("");

  // Arriving here first still counts as a first visit: the starter lists come too.
  useEffect(() => {
    createIfMissing(createStarterTrips);
  }, []);

  const problem = storage.status === "ready" ? storage.problem : null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (storage.status !== "ready" || !storage.data) return;
    const clean = cleanName(name);
    if (clean === "") return;
    const id = createId();
    const trip = { id, name: clean, items: [], lastPackedAt: null, promptDismissedAt: null, updatedAt: new Date().toISOString() };
    saveData({ ...storage.data, trips: [...storage.data.trips, trip] });
    // The empty list focuses its Add item field.
    router.push(`/trips/${id}`);
  }

  return (
    <Page title="New trip type" back={{ href: "/", label: "Back to My trips" }}>
      <StorageNotice problem={problem} />
      {/* Data from a newer version must not be written over. */}
      {problem !== "newer" && (
        <Card>
          <form noValidate onSubmit={submit} className="flex flex-col gap-4">
            <TextField
              label="Trip name"
              placeholder="e.g. Beach weekend"
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" variant="primary">
                Create list
              </Button>
              <ButtonLink href="/">Cancel</ButtonLink>
            </div>
          </form>
        </Card>
      )}
    </Page>
  );
}
