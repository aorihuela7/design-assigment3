"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/Card";
import { NewBadge } from "@/components/NewBadge";
import { Page } from "@/components/Page";
import { StorageNotice } from "@/components/StorageNotice";
import { useStorage } from "@/lib/storage";
import { groupBySection } from "@/lib/trips";

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

  if (!trip) {
    return <Page title="Packing list" back={BACK}>{null}</Page>;
  }

  return (
    <Page title={trip.name} back={BACK}>
      {storage.status === "ready" && <StorageNotice problem={storage.problem} />}

      {groupBySection(trip.items).map((group) => (
        <section key={group.section} aria-labelledby={`section-${group.section}`} className="flex flex-col gap-2">
          <h2 id={`section-${group.section}`} className="font-display text-2xl font-semibold uppercase tracking-wide">
            {group.label}
          </h2>
          <Card padded={false}>
            <ul className="divide-y divide-line">
              {group.items.map((item) => (
                <li key={item.id} className="flex min-h-11 items-center gap-3 px-4 py-2">
                  <span className="min-w-0 flex-1 wrap-anywhere">{item.name}</span>
                  {item.isNew && <NewBadge />}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ))}
    </Page>
  );
}
