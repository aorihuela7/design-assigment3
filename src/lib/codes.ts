// 3-letter airport-style codes for trip names.

const FILLER_WORDS = new Set(["A", "AN", "AND", "AT", "FOR", "IN", "OF", "ON", "THE", "TO"]);
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function words(name: string) {
  const all = name
    .normalize("NFD")
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const kept = all.filter((word) => !FILLER_WORDS.has(word));
  return kept.length > 0 ? kept : all;
}

// "Beach weekend" → "BEW", "Weekend at parents'" → "WEP", "Lisbon" → "LIS". Always 3 letters.
export function tripCode(name: string) {
  const w = words(name);
  const code =
    w.length >= 3
      ? w.slice(0, 3).map((word) => word[0]).join("")
      : w.length === 2
        ? w[0].slice(0, 2) + w[1][0]
        : (w[0] ?? "").slice(0, 3);
  return code.padEnd(3, "X");
}

// Codes unique among the given trips. Pass trips in a stable order (as stored),
// so a list keeps its code when the display order changes. On a clash the last
// letter changes: first to later letters of the name's last word, then A–Z.
export function uniqueCodes(trips: { id: string; name: string }[]) {
  const used = new Set<string>();
  const codes = new Map<string, string>();
  for (const trip of trips) {
    const base = tripCode(trip.name);
    let code = base;
    if (used.has(code)) {
      const lastWord = words(trip.name).at(-1) ?? "";
      const letters = new Set(lastWord.slice(1) + ALPHABET);
      code =
        [...letters].map((letter) => base.slice(0, 2) + letter).find((c) => !used.has(c)) ??
        // 26 clashes on the same two letters: change the middle letter too.
        [...ALPHABET].flatMap((a) => [...ALPHABET].map((b) => base[0] + a + b)).find((c) => !used.has(c)) ??
        base;
    }
    used.add(code);
    codes.set(trip.id, code);
  }
  return codes;
}
