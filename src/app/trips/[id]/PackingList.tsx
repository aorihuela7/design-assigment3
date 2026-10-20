"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/Card";
import { Page } from "@/components/Page";
import { RunwayProgress } from "@/components/RunwayProgress";
import { StorageNotice } from "@/components/StorageNotice";
import { saveData, useStorage, type Item } from "@/lib/storage";
import { groupBySection, withItems } from "@/lib/trips";
import { ItemRow } from "./ItemRow";

const BACK = { href: "/", label: "Back to My trips" };

export function PackingList() {
  const { id } = useParams<{ id: string }>();
  const storage = useStorage();
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
  const packed = trip.items.filter((item) => item.packed).length;

  return (
    <Page title={trip.name} back={BACK}>
      <RunwayProgress packed={packed} total={trip.items.length} />
      <StorageNotice problem={storage.problem} />

      {groupBySection(trip.items).map((group) => (
        <section key={group.section} aria-labelledby={`section-${group.section}`} className="flex flex-col gap-2">
          <h2 id={`section-${group.section}`} className="font-display text-2xl font-semibold uppercase tracking-wide">
            {group.label}
          </h2>
          <Card padded={false}>
            <ul className="divide-y divide-line">
              {group.items.map((item) => (
                <ItemRow key={item.id} item={item} onToggle={() => toggle(item.id)} />
              ))}
            </ul>
          </Card>
        </section>
      ))}
    </Page>
  );
}
