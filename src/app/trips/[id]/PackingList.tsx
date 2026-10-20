"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/Card";
import { Page } from "@/components/Page";
import { RunwayProgress } from "@/components/RunwayProgress";
import { StorageNotice } from "@/components/StorageNotice";
import { createId, saveData, useStorage, type Item, type Section } from "@/lib/storage";
import { groupBySection, withItems } from "@/lib/trips";
import { AddItemForm } from "./AddItemForm";
import { ItemRow } from "./ItemRow";

const BACK = { href: "/", label: "Back to My trips" };

export function PackingList() {
  const { id } = useParams<{ id: string }>();
  const storage = useStorage();
  const inputRef = useRef<HTMLInputElement>(null);
  // Read out by screen readers after adding or removing.
  const [announcement, setAnnouncement] = useState("");
  const trip = storage.status === "ready" ? storage.data?.trips.find((t) => t.id === id) : undefined;

  // The tab title names the list too, so the person knows where they are.
  const name = trip?.name;
  useEffect(() => {
    if (name) document.title = `${name} · Pack Again`;
  }, [name]);

  if (storage.status === "loading" || !storage.data || !trip) {
    return <Page title="Packing list" back={BACK}>{null}</Page>;
  }

  const { data } = storage;
  const tripId = trip.id;
  // Every change is saved straight away.
  const saveItems = (items: Item[]) => saveData(withItems(data, tripId, items));
  const toggle = (id: string) =>
    saveItems(trip.items.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)));
  const add = (itemName: string, section: Section) => {
    saveItems([...trip.items, { id: createId(), name: itemName, section, packed: false, isNew: false }]);
    setAnnouncement(`Added ${itemName}`);
  };
  const remove = (removed: Item) => {
    // Focus goes to the next item on screen, else the previous one, else the Add item field.
    const order = groupBySection(trip.items).flatMap((group) => group.items);
    const index = order.findIndex((item) => item.id === removed.id);
    const next = order[index + 1] ?? order[index - 1];
    saveItems(trip.items.filter((item) => item.id !== removed.id));
    setAnnouncement(`Removed ${removed.name}`);
    requestAnimationFrame(() => (next ? document.getElementById(`item-${next.id}`) : inputRef.current)?.focus());
  };
  const packed = trip.items.filter((item) => item.packed).length;

  return (
    <Page title={trip.name} back={BACK}>
      <RunwayProgress packed={packed} total={trip.items.length} />
      <StorageNotice problem={storage.problem} />
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <AddItemForm items={trip.items} onAdd={add} inputRef={inputRef} />

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
    </Page>
  );
}
