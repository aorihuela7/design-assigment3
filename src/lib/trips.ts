import { SECTIONS, type Item, type Section, type StoredData, type Trip } from "./storage";

export type SectionGroup = { section: Section; label: string; items: Item[] };

// Sections in their fixed order, empty ones left out. New items come first in
// each section, otherwise items keep the order they were added in.
export function groupBySection(items: Item[]): SectionGroup[] {
  return SECTIONS.map(({ value, label }) => {
    const inSection = items.filter((item) => item.section === value);
    return {
      section: value,
      label,
      items: [...inSection.filter((item) => item.isNew), ...inSection.filter((item) => !item.isNew)],
    };
  }).filter((group) => group.items.length > 0);
}

export function isAllPacked(items: Item[]) {
  return items.length > 0 && items.every((item) => item.packed);
}

// Replaces one trip's items and stamps updatedAt, ready to save. On the change that
// makes the list fully packed (not on page loads), it also records lastPackedAt and
// clears the New marks.
export function withItems(
  data: StoredData,
  tripId: string,
  items: Item[],
  changes: Partial<Pick<Trip, "promptDismissedAt">> = {},
): StoredData {
  const now = new Date().toISOString();
  return {
    ...data,
    trips: data.trips.map((t) => {
      if (t.id !== tripId) return t;
      const trip = { ...t, ...changes };
      if (!isAllPacked(trip.items) && isAllPacked(items)) {
        return {
          ...trip,
          items: items.map((item) => ({ ...item, isNew: false })),
          lastPackedAt: now,
          updatedAt: now,
        };
      }
      return { ...trip, items, updatedAt: now };
    }),
  };
}

export const MAX_ITEM_NAME = 60;

// Trims and collapses inner spaces: "  Phone   charger " → "Phone charger".
export function cleanName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

// Returns what to do next, or null when the name can be added.
export function itemNameError(name: string, items: Item[]): string | null {
  const clean = cleanName(name);
  if (clean === "") return "Enter an item name";
  if (clean.length > MAX_ITEM_NAME) return `Keep it under ${MAX_ITEM_NAME} characters`;
  const existing = items.find((item) => cleanName(item.name).toLowerCase() === clean.toLowerCase());
  if (existing) {
    const section = SECTIONS.find((s) => s.value === existing.section)?.label ?? "Other";
    return `${existing.name} is already in ${section}`;
  }
  return null;
}

// Unticks everything for the next trip; New marks and lastPackedAt stay.
export function untickAll(items: Item[]): Item[] {
  return items.map((item) => ({ ...item, packed: false }));
}
