"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PAGE_TITLE_ID } from "@/components/Header";
import { Page } from "@/components/Page";
import { StorageNotice } from "@/components/StorageNotice";
import { createId, saveData, SECTIONS, useStorage, type Item, type Section } from "@/lib/storage";
import { groupBySection, isAllPacked, shouldAskNewTrip, untickAll, withItems } from "@/lib/trips";
import { useNow } from "@/lib/useNow";
import { AddItemForm } from "./AddItemForm";
import { BACK_TO_MY_TRIPS, ListLoading } from "./ListLoading";
import { ItemRow, RemovedRow, UNDO_ROW_ID, undoHoldProps, type UndoHold } from "./ItemRow";
import { ProgressBar } from "./ProgressBar";

const COUNT_ID = "packed-count";
const UNDO_BAR_ID = "undo-bar";
// How long Undo stays after you move away from it.
const UNDO_MS = 5000;

// When Undo times out while focused, focus moves to the next item on screen
// (or the previous one, or the Add item field), so it's never lost.
function moveFocusOffUndo() {
  const row = document.getElementById(UNDO_ROW_ID)?.closest("li");
  const active = document.activeElement;
  if (!row || !(row.contains(active) || active?.id === UNDO_BAR_ID)) return null;
  const boxes = [...document.querySelectorAll<HTMLElement>("main input[type=checkbox]")];
  return (
    boxes.find((box) => row.compareDocumentPosition(box) & Node.DOCUMENT_POSITION_FOLLOWING) ??
    boxes.at(-1) ??
    document.querySelector<HTMLElement>("main form input")
  );
}

export function PackingList() {
  const { id } = useParams<{ id: string }>();
  const storage = useStorage();
  const now = useNow();
  const inputRef = useRef<HTMLInputElement>(null);
  // The latest change, shown in the progress bar and read out politely. After a
  // removal it carries what's needed to undo it, until the next change.
  const [feedback, setFeedback] = useState<{ text: string | null; undo?: { item: Item; index: number } } | null>(
    null,
  );
  const setAnnouncement = (text: string) => setFeedback({ text });

  // Undo disappears UNDO_MS after a removal, counting again from when the pointer
  // or keyboard focus leaves it.
  const pendingId = feedback?.undo?.item.id ?? null;
  const [hold, setHold] = useState({ id: null as string | null, pointer: false, focus: false });
  const holdUndo: UndoHold = (reason, held) =>
    setHold((current) => ({
      ...(current.id === pendingId ? current : { pointer: false, focus: false }),
      id: pendingId,
      [reason]: held,
    }));
  const undoHeld = pendingId !== null && hold.id === pendingId && (hold.pointer || hold.focus);
  useEffect(() => {
    if (pendingId === null || undoHeld) return;
    const timer = setTimeout(() => {
      const next = moveFocusOffUndo();
      setFeedback((current) => (current?.undo?.item.id === pendingId ? null : current));
      if (next) requestAnimationFrame(() => next.focus());
    }, UNDO_MS);
    return () => clearTimeout(timer);
  }, [pendingId, undoHeld]);
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
  // Otherwise focus starts on the list name, so the next Tab reaches "Back to My trips".
  // Only on arrival: later changes (like removing the last item) manage focus themselves.
  const arrived = useRef(false);
  useEffect(() => {
    if (!hasTrip || arrived.current) return;
    arrived.current = true;
    if (isEmpty || wantsAdd) inputRef.current?.focus();
    else document.getElementById(PAGE_TITLE_ID)?.focus({ preventScroll: true });
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
  // A placeholder row with Undo takes the item's place (and focus) for a few seconds.
  const remove = (removed: Item) => {
    saveItems(trip.items.filter((item) => item.id !== removed.id));
    setFeedback({ text: `Removed ${removed.name}.`, undo: { item: removed, index: trip.items.indexOf(removed) } });
    requestAnimationFrame(() => document.getElementById(UNDO_ROW_ID)?.focus());
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
    saveData(withItems(data, tripId, untickAll(trip.items), { ticksClearedAt: new Date().toISOString() }));
    setAnnouncement("Ticks cleared");
    focusCount();
  };
  // Both answers to "Packing for a new trip?" record the answer, so it isn't asked again
  // until the next full pack.
  const answerNewTrip = (clear: boolean) => {
    const now = new Date().toISOString();
    const changes = clear ? { promptDismissedAt: now, ticksClearedAt: now } : { promptDismissedAt: now };
    saveData(withItems(data, tripId, clear ? untickAll(trip.items) : trip.items, changes));
    if (clear) setAnnouncement("Ticks cleared");
    focusCount();
  };
  const packed = trip.items.filter((item) => item.packed).length;
  // The removed item stays on screen as a placeholder, in its old position.
  const pending = feedback?.undo;
  const rows = pending
    ? [...trip.items.slice(0, pending.index), pending.item, ...trip.items.slice(pending.index)]
    : trip.items;

  return (
    <Page title={trip.name} back={BACK_TO_MY_TRIPS}>
      <ProgressBar
        packed={packed}
        total={trip.items.length}
        countId={COUNT_ID}
        allPacked={allPacked}
        onForgot={() => {
          // Centered, so the sticky bar doesn't cover the field.
          inputRef.current?.scrollIntoView({ block: "center" });
          inputRef.current?.focus({ preventScroll: true });
        }}
        message={
          feedback?.text && (
            <>
              <p>{feedback.text}</p>
              {feedback.undo && (
                <Button
                  id={UNDO_BAR_ID}
                  {...undoHoldProps(holdUndo)}
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
              <Button onClick={() => answerNewTrip(true)}>Clear all ticks</Button>
              <Button onClick={() => answerNewTrip(false)}>Keep them</Button>
            </div>
          </Card>
        </section>
      )}

      <AddItemForm
        items={trip.items}
        onAdd={add}
        // Clears the bar's message; a pending Undo row stays, since nothing in the list changed.
        onError={() => setFeedback((current) => (current?.undo ? { ...current, text: null } : null))}
        inputRef={inputRef}
        forgotMode={allPacked}
      />

      {trip.items.length === 0 && !pending && (
        <Card>
          <p>Nothing here yet. Add your first item.</p>
        </Card>
      )}

      {groupBySection(rows).map((group) => (
        <section key={group.section} aria-labelledby={`section-${group.section}`} className="flex flex-col gap-2">
          <h2 id={`section-${group.section}`} className="font-display text-2xl font-semibold uppercase tracking-wide">
            {group.label}
          </h2>
          <Card padded={false}>
            <ul className="divide-y divide-line">
              {group.items.map((item) =>
                item.id === pending?.item.id ? (
                  <RemovedRow
                    key={`removed-${item.id}`}
                    name={item.name}
                    onUndo={() => undoRemove(pending)}
                    onHold={holdUndo}
                  />
                ) : (
                  <ItemRow key={item.id} item={item} onToggle={() => toggle(item.id)} onRemove={() => remove(item)} />
                ),
              )}
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
