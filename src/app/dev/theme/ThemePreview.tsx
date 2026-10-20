"use client";

import { useState, type ReactNode } from "react";
import { BackLink } from "@/components/BackLink";
import { BoardingPassCard } from "@/components/BoardingPassCard";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SelectField, TextField } from "@/components/Field";
import { Header } from "@/components/Header";
import { NewBadge } from "@/components/NewBadge";
import { Page } from "@/components/Page";
import { RunwayProgress } from "@/components/RunwayProgress";
import { SECTIONS, useStorage } from "@/lib/storage";

const COLORS = [
  ["canvas", "Background", "#E8EDF2"],
  ["surface", "Surface", "#FBFAF6"],
  ["ink", "Text", "#0E1B2E"],
  ["muted", "Muted", "#46566B"],
  ["line", "Border", "#BCC7D3"],
  ["board", "Board", "#0B1F3A"],
  ["amber", "Board text", "#FFB81C"],
  ["accent", "Accent", "#B83A0A"],
] as const;

const SWATCH: Record<(typeof COLORS)[number][0], string> = {
  canvas: "bg-canvas",
  surface: "bg-surface",
  ink: "bg-ink",
  muted: "bg-muted",
  line: "bg-line",
  board: "bg-board",
  amber: "bg-amber",
  accent: "bg-accent",
};

const sectionOptions = SECTIONS.map(({ value, label }) => ({ value, label }));

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-semibold uppercase tracking-wide">{title}</h2>
      {note && <p className="text-sm text-muted">{note}</p>}
      {children}
    </section>
  );
}

function Label({ children }: { children: string }) {
  return <p className="font-mono text-xs uppercase tracking-wider text-muted">{children}</p>;
}

export function ThemePreview() {
  const storage = useStorage();
  const [packed, setPacked] = useState(7);
  const total = 15;

  return (
    <Page title="Theme preview" back={{ href: "/", label: "Back to My trips" }}>
      <p className="text-sm text-muted">
        Dev only, remove before shipping. Hover, Tab and press each control to see its live states;
        disabled and error states are shown directly.
      </p>

      <Section title="Colors">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLORS.map(([token, name, hex]) => (
            <li key={token} className="flex flex-col gap-1">
              <span aria-hidden="true" className={`h-12 rounded border border-line ${SWATCH[token]}`} />
              <span className="text-sm">{name}</span>
              <span className="font-mono text-xs text-muted">
                {token} {hex}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Type">
        <Card>
          <p className="font-display text-4xl font-semibold uppercase tracking-wide">Beach weekend</p>
          <p className="mt-2">B612 body text. Sunscreen, towel, the charger you always forget.</p>
          <p className="mt-1 text-muted">Muted text for secondary information.</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wider">B612 Mono · BEW · 7/15 packed</p>
        </Card>
      </Section>

      <Section title="Header" note="The band at the top of this page. Tab to the Pack Again link to see the amber focus ring.">
        <div className="overflow-hidden rounded border border-line">
          <Header title="A long page name that wraps" />
        </div>
      </Section>

      <Section title="Button">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Primary</Label>
            <Button variant="primary">Add item</Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Primary, disabled</Label>
            <Button variant="primary" disabled>
              Add item
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Secondary</Label>
            <Button>Clear all ticks</Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Secondary, disabled</Label>
            <Button disabled>Clear all ticks</Button>
          </div>
        </div>
      </Section>

      <Section title="TextField">
        <Card className="flex flex-col gap-5">
          <TextField label="Item name" placeholder="e.g. Phone charger" />
          <TextField label="Item name, filled" defaultValue="Sunscreen" />
          <TextField label="Item name, error" defaultValue="" error="Enter an item name" />
          <TextField
            label="Item name, error keeps the text"
            defaultValue="Sunscreen"
            error="Sunscreen is already in Toiletries"
          />
          <TextField label="Item name, disabled" defaultValue="Sunscreen" disabled />
        </Card>
      </Section>

      <Section title="SelectField">
        <Card className="flex flex-col gap-5">
          <SelectField label="Section" options={sectionOptions} defaultValue="toiletries" />
          <SelectField label="Section, error" options={sectionOptions} error="Choose a section" />
          <SelectField label="Section, disabled" options={sectionOptions} defaultValue="tech" disabled />
        </Card>
      </Section>

      <Section title="Card">
        <Card>Static card. No hover state.</Card>
        <Card href="/dev/theme">Link card. Hover, Tab and press it.</Card>
      </Section>

      <Section title="BackLink">
        <BackLink href="/">Back to My trips</BackLink>
      </Section>

      <Section title="BoardingPassCard" note="Links: hover, Tab and press. The stub moves below when the card is narrower than 28rem.">
        <BoardingPassCard code="BEW" name="Beach weekend" packed={7} total={15} lastPackedAt="2026-10-12T10:00:00Z" href="/dev/theme" />
        <BoardingPassCard
          code="COT"
          name="Conference trip"
          packed={18}
          total={18}
          lastPackedAt="2026-09-03T10:00:00Z"
          newCount={2}
          href="/dev/theme"
        />
        <BoardingPassCard code="WEP" name="Weekend at parents'" packed={0} total={12} lastPackedAt={null} href="/dev/theme" />
        <BoardingPassCard code="SNL" name="Static, not a link" packed={3} total={9} lastPackedAt={null} />
        <Label>Narrow (stub below)</Label>
        <div className="max-w-xs">
          <BoardingPassCard code="BEW" name="Beach weekend" packed={7} total={15} lastPackedAt="2026-10-12T10:00:00Z" href="/dev/theme" />
        </div>
        <div className="max-w-xs">
          <BoardingPassCard
            code="VLT"
            name="A very long trip type name that wraps"
            packed={0}
            total={0}
            lastPackedAt={null}
            newCount={1}
          />
        </div>
      </Section>

      <Section title="RunwayProgress" note="The plane glides when the count changes, and jumps instead if reduced motion is on.">
        <Card className="flex flex-col gap-4">
          <RunwayProgress packed={packed} total={total} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setPacked((n) => Math.max(0, n - 1))} disabled={packed === 0}>
              Untick one
            </Button>
            <Button onClick={() => setPacked((n) => Math.min(total, n + 1))} disabled={packed === total}>
              Tick one
            </Button>
          </div>
          <Label>Fixed: 0/15, 15/15, 0/0</Label>
          <RunwayProgress packed={0} total={15} />
          <RunwayProgress packed={15} total={15} />
          <RunwayProgress packed={0} total={0} />
        </Card>
      </Section>

      <Section title="NEW badge">
        <div className="flex gap-3">
          <NewBadge />
          <NewBadge>2 new</NewBadge>
        </div>
      </Section>

      <Section title="Storage" note="What useStorage() returns in this browser. Server and first render show loading.">
        <Card>
          <pre className="font-mono text-xs whitespace-pre-wrap">{JSON.stringify(storage, null, 2)}</pre>
        </Card>
      </Section>
    </Page>
  );
}
