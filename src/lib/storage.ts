import { useSyncExternalStore } from "react";

// Data model. Everything lives in localStorage under one versioned key.

export const STORAGE_KEY = "pack-again:v1";
export const BACKUP_KEY = "pack-again:backup";
export const VERSION = 1;

export const SECTIONS = [
  { value: "clothes", label: "Clothes" },
  { value: "toiletries", label: "Toiletries" },
  { value: "tech", label: "Tech" },
  { value: "documents", label: "Documents" },
  { value: "other", label: "Other" },
] as const;

export type Section = (typeof SECTIONS)[number]["value"];

export type Item = {
  id: string;
  name: string;
  section: Section;
  packed: boolean;
  isNew: boolean; // added after a full pack, cleared on the next full pack
};

export type Trip = {
  id: string;
  name: string;
  items: Item[];
  lastPackedAt: string | null; // set when every item is ticked
  promptDismissedAt: string | null; // "Keep them" pressed on the new-trip prompt
  updatedAt: string; // sorts My trips
};

export type StoredData = {
  version: typeof VERSION;
  trips: Trip[];
};

// blocked: storage unavailable, changes last only until the tab closes.
// recovered: unreadable data was copied to BACKUP_KEY and the app started fresh.
// newer: saved by a newer version of the app; never overwritten.
// full: the last save failed because storage is full.
export type StorageProblem = "blocked" | "recovered" | "newer" | "full";

export type StorageState =
  | { status: "loading" }
  // data is null on a first visit (nothing saved yet) and when data can't be used.
  | { status: "ready"; data: StoredData | null; problem: StorageProblem | null };

export type SaveResult = "ok" | "blocked" | "full" | "newer";

export function createId() {
  // randomUUID only exists on secure origins (https, localhost).
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// Validation

type Parsed =
  | { kind: "ok"; data: StoredData; dropped: number }
  | { kind: "newer" }
  | { kind: "unreadable" };

const SECTION_VALUES = new Set<string>(SECTIONS.map((section) => section.value));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function parseItem(value: unknown): Item | null {
  if (!isRecord(value) || !isText(value.id) || !isText(value.name)) return null;
  return {
    id: value.id,
    name: value.name,
    section: SECTION_VALUES.has(value.section as string) ? (value.section as Section) : "other",
    packed: value.packed === true,
    isNew: value.isNew === true,
  };
}

function parseTrip(value: unknown): { trip: Trip; dropped: number } | null {
  if (!isRecord(value) || !isText(value.id) || !isText(value.name) || !Array.isArray(value.items)) {
    return null;
  }
  const items: Item[] = [];
  const ids = new Set<string>();
  for (const raw of value.items) {
    const item = parseItem(raw);
    if (item && !ids.has(item.id)) {
      ids.add(item.id);
      items.push(item);
    }
  }
  const lastPackedAt = isDate(value.lastPackedAt) ? value.lastPackedAt : null;
  return {
    trip: {
      id: value.id,
      name: value.name,
      items,
      lastPackedAt,
      promptDismissedAt: isDate(value.promptDismissedAt) ? value.promptDismissedAt : null,
      updatedAt: isDate(value.updatedAt) ? value.updatedAt : (lastPackedAt ?? new Date(0).toISOString()),
    },
    dropped: value.items.length - items.length,
  };
}

// Keeps every valid trip and item, drops the rest.
export function parseData(raw: string): Parsed {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { kind: "unreadable" };
  }
  if (!isRecord(json) || typeof json.version !== "number") return { kind: "unreadable" };
  if (json.version > VERSION) return { kind: "newer" };
  if (json.version !== VERSION || !Array.isArray(json.trips)) return { kind: "unreadable" };

  const trips: Trip[] = [];
  const ids = new Set<string>();
  let dropped = 0;
  for (const raw of json.trips) {
    const parsed = parseTrip(raw);
    if (!parsed || ids.has(parsed.trip.id)) {
      dropped += 1;
      continue;
    }
    ids.add(parsed.trip.id);
    trips.push(parsed.trip);
    dropped += parsed.dropped;
  }
  return { kind: "ok", data: { version: VERSION, trips }, dropped };
}

// Reading and writing

function canWrite() {
  try {
    const probe = "pack-again:probe";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function load(): StorageState {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { status: "ready", data: null, problem: "blocked" };
  }
  const writable = canWrite();
  if (raw === null) return { status: "ready", data: null, problem: writable ? null : "blocked" };

  const parsed = parseData(raw);
  if (parsed.kind === "newer") return { status: "ready", data: null, problem: "newer" };
  if (parsed.kind === "ok") {
    // Keep the original if anything was dropped, before a save replaces it.
    if (parsed.dropped > 0 && writable) {
      try {
        window.localStorage.setItem(BACKUP_KEY, raw);
      } catch {
        // Full: keep going with the valid data.
      }
    }
    return { status: "ready", data: parsed.data, problem: writable ? null : "blocked" };
  }

  // Unreadable: back it up, then start fresh. Without a backup, leave it untouched.
  if (!writable) return { status: "ready", data: null, problem: "blocked" };
  try {
    window.localStorage.setItem(BACKUP_KEY, raw);
    const fresh: StoredData = { version: VERSION, trips: [] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return { status: "ready", data: fresh, problem: "recovered" };
  } catch {
    return { status: "ready", data: null, problem: "blocked" };
  }
}

function isQuotaError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

function write(data: StoredData): SaveResult {
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current !== null && parseData(current).kind === "newer") return "newer";
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return "ok";
  } catch (error) {
    return isQuotaError(error) ? "full" : "blocked";
  }
}

// React binding. The server and the first client render both see "loading",
// so there is no hydration mismatch; storage is read only after mount.

const LOADING: StorageState = { status: "loading" };
let snapshot: StorageState | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the data: read it again.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      snapshot = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  snapshot ??= load();
  return snapshot;
}

function getServerSnapshot() {
  return LOADING;
}

export function saveData(data: StoredData): SaveResult {
  const previous = getSnapshot();
  if (previous.status === "ready" && previous.problem === "newer") return "newer";
  const result = write(data);
  // Keep changes in memory even if they couldn't be saved, so the page still works.
  const problem: StorageProblem | null =
    result === "ok"
      ? previous.status === "ready" && previous.problem === "recovered"
        ? "recovered"
        : null
      : result;
  snapshot = { status: "ready", data: result === "newer" ? null : data, problem };
  listeners.forEach((listener) => listener());
  return result;
}

// First visit: saves the given trips only if nothing was ever saved. Never runs over
// recovered, empty or newer data, and is safe to call twice (Strict Mode effects).
export function createIfMissing(createTrips: () => Trip[]) {
  const current = getSnapshot();
  if (current.status === "ready" && current.data === null && current.problem !== "newer") {
    saveData({ version: VERSION, trips: createTrips() });
  }
}

export function useStorage(): StorageState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
