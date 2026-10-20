// Checks WCAG contrast for the color pairs the theme uses.
// Reads the colors from src/app/globals.css so the check can't drift from the tokens.
// Usage: npm run check:contrast

import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const colors = Object.fromEntries(
  [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, hex]) => [name, hex]),
);

const TEXT = 4.5; // body and muted text
const UI = 3; // focus rings and field borders (WCAG 1.4.11)

// [foreground, background, minimum, what it is]
const pairs = [
  ["ink", "canvas", TEXT, "Body text on page"],
  ["ink", "surface", TEXT, "Body text on cards and fields"],
  ["muted", "canvas", TEXT, "Muted text on page"],
  ["muted", "surface", TEXT, "Muted text on cards and fields"],
  ["ink", "line", TEXT, "Secondary button text, pressed"],
  ["amber", "board", TEXT, "Board text on the Departures band"],
  ["white", "accent", TEXT, "Primary button text"],
  ["white", "accent-hover", TEXT, "Primary button text, hover"],
  ["white", "accent-pressed", TEXT, "Primary button text, pressed"],
  ["board", "canvas", UI, "Focus ring on page"],
  ["board", "surface", UI, "Focus ring on cards"],
  ["amber", "board", UI, "Focus ring on the Departures band"],
  ["muted", "surface", UI, "Field border"],
  ["ink", "surface", UI, "Secondary button border"],
  ["line", "surface", null, "Card border and tear line (decorative)"],
  ["line", "canvas", null, "Notch outline (decorative)"],
];

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failed = false;
for (const [fg, bg, min, label] of pairs) {
  if (!colors[fg] || !colors[bg]) throw new Error(`Missing token: ${colors[fg] ? bg : fg}`);
  const r = ratio(colors[fg], colors[bg]);
  const status = min === null ? "info" : r >= min ? "pass" : "FAIL";
  if (status === "FAIL") failed = true;
  const need = min === null ? "  -  " : `${min.toFixed(1)}:1`;
  console.log(
    `${status.padEnd(4)}  ${r.toFixed(2).padStart(5)}:1  (need ${need})  ${fg} on ${bg}  ${label}`,
  );
}

process.exit(failed ? 1 : 0);
