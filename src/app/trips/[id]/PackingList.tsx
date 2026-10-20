"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Page } from "@/components/Page";
import { StorageNotice } from "@/components/StorageNotice";
import { createId, saveData, SECTIONS, useStorage, type Item, type Section } from "@/lib/storage";
import { groupBySection, isAllPacked, shouldAskNewTrip, untickAll, withItems } from "@/lib/trips";
import { useNow } from "@/lib/useNow";
import { AddItemForm } from "./AddItemForm";
import { BACK_TO_MY_TRIPS, ListLoading } from "./ListLoading";
import { ItemRow } from "./ItemRow";
import { ProgressBar } from "./ProgressBar";

const COUNT_ID = "packed-count";

export function PackingList() {
  const { id } = useParams<{ id: string }>();
  const storage = useStorage();
  const now = useNow();
  const inputRef = useRef<HTMLInputElement>(null);
  // The latest change, shown in the progress bar and read out politely. After a
  // removal it carries what's needed to undo it, until the next change.
  const [feedback, setFeedback] = useState<{ text: string; undo?: { item: Item; index: number } } | null>(null);
  const setAnnouncement = (text: string) => setFeedback({ text });
  const trip = storage.status === "ready" ? storage.data?.trips.find((t) => t.id === id) : undefined;

  // The tab title names the list too, so the person knows where they are.
  const tabTitle =
    trip?.name ?? (storage.status === "ready" && storage.problem !== "newer" ? "List not found" : null);
  useEffect(() => {
    if (tabTitle) document.title = `${tabTitle} · Pack Again`;
  }, [tabTitle]);

  // Opens ready to type when the list is empty, or when asked with ?add=1
  // ("Forgot something? Add it" on My trips).
  const wantsAdd = useSearchParams().get("add") === "1";
  const isEmpty = trip?.items.length === 0;
  const hasTrip = Boolean(trip);
  useEffect(() => {
    if (hasTrip && (isEmpty || wantsAdd)) inputRef.current?.focus();
  }, [hasTrip, isEmpty, wantsAdd]);

  if (storage.status === "loading") return <ListLoading />;

  // Saved by a newer version: nothing here can be shown or changed safely.
  if (storage.problem === "newer") {
    return (
      <Page title="Packing list" back={BACK_TO_MY_TRIPS}>
        <StorageNotice problem="newer" />
      </Page>
    );
  }

  // Unknown id: an old bookmark, a deleted list, or nothing saved yet.
  if (!storage.data || !trip) {
    return (
      <Page title="List not found" back={BACK_TO_MY_TRIPS}>
        <StorageNotice problem={storage.problem} />
        <Card>
          <p>This list doesn’t exist anymore.</p>
        </Card>
      </Page>
    );
  }

  const { data } = storage;
  const tripId = trip.id;
  // Every change is saved straight away.
  const saveItems = (items: Item[]) => saveData(withItems(data, tripId, items));
  const toggle = (id: string) => {
    saveItems(trip.items.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)));
    setFeedback(null);
  };
  const allPacked = isAllPacked(trip.items);
  const add = (itemName: string, section: Section) => {
    // Added after a full pack ("Forgot something?"): saved as packed and New, so the
    // list stays All packed and the item stands out next trip.
    const item = { id: createId(), name: itemName, section, packed: allPacked, isNew: allPacked };
    saveItems([...trip.items, item]);
    // Visible too: the new row may be far down the page.
    setAnnouncement(`Added ${itemName} to ${SECTIONS.find((s) => s.value === section)?.label ?? "Other"}`);
  };
  const remove = (removed: Item) => {
    // Focus goes to the next item on screen, else the previous one, else the Add item field.
    const order = groupBySection(trip.items).flatMap((group) => group.items);
    const index = order.findIndex((item) => item.id === removed.id);
    const next = order[index + 1] ?? order[index - 1];
    saveItems(trip.items.filter((item) => item.id !== removed.id));
    setFeedback({ text: `Removed ${removed.name}.`, undo: { item: removed, index: trip.items.indexOf(removed) } });
    requestAnimationFrame(() => (next ? document.getElementById(`item-${next.id}`) : inputRef.current)?.focus());
  };
  // Puts the item back where it was and moves focus to it.
  const undoRemove = ({ item, index }: { item: Item; index: number }) => {
    const items = [...trip.items];
    items.splice(index, 0, item);
    saveItems(items);
    setAnnouncement(`Restored ${item.name}`);
    requestAnimationFrame(() => document.getElementById(`item-${item.id}`)?.focus());
  };
  const focusCount = () => requestAnimationFrame(() => document.getElementById(COUNT_ID)?.focus());
  const clearTicks = () => {
    saveItems(untickAll(trip.items));
    setAnnouncement("Ticks cleared");
    focusCount();
  };
  // Both answers to "Packing for a new trip?" record the answer, so it isn't asked again
  // until the next full pack.
  const answerNewTrip = (clear: boolean) => {
    const promptDismissedAt = new Date().toISOString();
    saveData(withItems(data, tripId, clear ? untickAll(trip.items) : trip.items, { promptDismissedAt }));
    if (clear) setAnnouncement("Ticks cleared");
    focusCount();
  };
  const packed = trip.items.filter((item) => item.packed).length;

  return (
    <Page title={trip.name} back={BACK_TO_MY_TRIPS}>
      <ProgressBar
        packed={packed}
        total={trip.items.length}
        countId={COUNT_ID}
        allPacked={allPacked}
        message={
          feedback && (
            <>
              <p>{feedback.text}</p>
              {feedback.undo && (
                <Button
                  aria-label={`Undo removing ${feedback.undo.item.name}`}
                  onClick={() => feedback.undo && undoRemove(feedback.undo)}
                >
                  Undo
                </Button>
              )}
            </>
          )
        }
      />
      <StorageNotice problem={storage.problem} />

      {/* In the page, not a modal, and it never takes focus on load. */}
      {now !== null && shouldAskNewTrip(trip, now) && (
        <section role="region" aria-labelledby="new-trip-heading">
          <Card className="flex flex-col gap-4">
            <h2 id="new-trip-heading" className="font-display text-2xl font-semibold uppercase tracking-wide">
              Packing for a new trip?
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => answerNewTrip(true)}>Clear ticks</Button>
              <Button onClick={() => answerNewTrip(false)}>Keep them</Button>
            </div>
          </Card>
        </section>
      )}

      <AddItemForm items={trip.items} onAdd={add} inputRef={inputRef} forgotMode={allPacked} />

      {trip.items.length === 0 && (
        <Card>
          <p>Nothing here yet. Add your first item.</p>
        </Card>
      )}

      {groupBySection(trip.items).map((group) => (
        <section key={group.section} aria-labelledby={`section-${group.section}`} className="flex flex-col gap-2">
          <h2 id={`section-${group.section}`} className="font-display text-2xl font-semibold uppercase tracking-wide">
            {group.label}
          </h2>
          <Card padded={false}>
            <ul className="divide-y divide-line">
              {group.items.map((item) => (
                <ItemRow key={item.id} item={item} onToggle={() => toggle(item.id)} onRemove={() => remove(item)} />
              ))}
            </ul>
          </Card>
        </section>
      ))}

      {trip.items.length > 0 && (
        <div>
          <Button onClick={clearTicks} disabled={packed === 0}>
            Clear all ticks
          </Button>
        </div>
      )}
    </Page>
  );
}
