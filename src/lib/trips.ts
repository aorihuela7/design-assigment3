import { SECTIONS, type Item, type Section, type StoredData } from "./storage";

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

// Replaces one trip's items and stamps updatedAt, ready to save.
export function withItems(data: StoredData, tripId: string, items: Item[]): StoredData {
  const now = new Date().toISOString();
  return {
    ...data,
    trips: data.trips.map((trip) => (trip.id === tripId ? { ...trip, items, updatedAt: now } : trip)),
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
