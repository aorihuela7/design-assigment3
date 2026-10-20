import { SECTIONS, type Item, type Section } from "./storage";

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
