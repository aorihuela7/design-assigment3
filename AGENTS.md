# Pack Again — packing lists for trips you repeat (Design, Build, Ship, Assignment 3)

## Rules
- Next.js (App Router) + Tailwind CSS. Data lives only in the browser (localStorage). No database, accounts, external APIs, or new packages without asking me first.
- Small commits, one per change, with specific messages.
- Never one-shot a feature: work in the steps I ask for.
- Remove anything unnecessary: steps, fields, interactions, words.

## Flows
First visit (useful right away, never an empty dead end) → main task (build and tick off a packing list) → coming back (it remembers me, with a reason to return).

## Forms
One column. A visible label on every field. Errors sit next to the field and say what to do next ("Enter an item name", not "Invalid input"). Keep what the person typed when there is an error.

## Components
Shared components for buttons, inputs, fields (label + error), cards, and navigation, used consistently everywhere.

## Navigation
The person always knows where they are and how to go back.

## Accessibility
Everything works with a keyboard, visible focus ring, real labels, text contrast at least 4.5:1, checked by script. Never use color alone to convey state.

## Storage
Client-side only. Versioned key, validate what you read, handle corrupt or missing data without crashing, avoid hydration mismatches in Next.js, and show a brief loading state until data is read.

## Docs
README.md must show the flows diagram and the first-run usability check.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
