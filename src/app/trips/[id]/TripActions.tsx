import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextField } from "@/components/Field";
import { tripNameMessage } from "@/components/tripNameMessage";
import type { Trip } from "@/lib/storage";
import { cleanName, tripNameProblem } from "@/lib/trips";

type TripActionsProps = {
  trip: Trip;
  otherTrips: Trip[];
  packed: number;
  onClearTicks: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
};

// The bottom of the list: Clear all ticks, Rename trip and Delete trip. Rename and
// Delete open in place (never a modal); Escape or Cancel closes them and focus
// goes back to the button that opened them.
export function TripActions({ trip, otherTrips, packed, onClearTicks, onRename, onDelete }: TripActionsProps) {
  const [mode, setMode] = useState<"idle" | "rename" | "delete">("idle");
  const renameButton = useRef<HTMLButtonElement>(null);
  const deleteButton = useRef<HTMLButtonElement>(null);

  const close = () => {
    const opener = mode === "rename" ? renameButton : deleteButton;
    setMode("idle");
    requestAnimationFrame(() => opener.current?.focus());
  };

  if (mode === "delete") {
    return <DeleteConfirm trip={trip} onDelete={onDelete} onCancel={close} />;
  }

  if (mode === "rename") {
    return (
      <RenameForm
        current={trip.name}
        otherTrips={otherTrips}
        onSave={(name) => {
          if (name !== trip.name) onRename(name);
          close();
        }}
        onCancel={close}
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {trip.items.length > 0 && (
        <Button onClick={onClearTicks} disabled={packed === 0}>
          Clear all ticks
        </Button>
      )}
      <Button ref={renameButton} onClick={() => setMode("rename")}>
        Rename trip
      </Button>
      <Button ref={deleteButton} onClick={() => setMode("delete")}>
        Delete trip
      </Button>
    </div>
  );
}

// The question takes focus, so a second Enter can't delete by accident; Tab
// reaches Delete trip, then Cancel.
function DeleteConfirm({ trip, onDelete, onCancel }: { trip: Trip; onDelete: () => void; onCancel: () => void }) {
  const items = trip.items.length;
  const question = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    question.current?.focus();
  }, []);
  return (
    <Card>
      <div
        role="group"
        aria-labelledby="delete-question"
        onKeyDown={(event) => event.key === "Escape" && onCancel()}
        className="flex flex-col gap-4"
      >
        <p
          id="delete-question"
          tabIndex={-1}
          ref={question}
          className="font-semibold text-ink outline-none"
        >
          Delete {trip.name}
          {items > 0 && ` and its ${items} ${items === 1 ? "item" : "items"}`}? This can’t be undone.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onDelete}>Delete trip</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </Card>
  );
}

type RenameFormProps = {
  current: string;
  otherTrips: Trip[];
  onSave: (name: string) => void;
  onCancel: () => void;
};

function RenameForm({ current, otherTrips, onSave, onCancel }: RenameFormProps) {
  const [name, setName] = useState(current);
  // Same rules as New trip: no errors before the first save, then they follow what's typed.
  const [attempted, setAttempted] = useState(false);
  const problem = attempted ? tripNameProblem(name, otherTrips) : null;
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (tripNameProblem(name, otherTrips)) {
      setAttempted(true); // keeps exactly what was typed
      inputRef.current?.focus();
      return;
    }
    onSave(cleanName(name));
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") onCancel();
  }

  return (
    <Card>
      <form noValidate onSubmit={submit} onKeyDown={onKeyDown} aria-label="Rename trip" className="flex flex-col gap-4">
        <TextField
          ref={inputRef}
          label="Trip name"
          autoComplete="off"
          autoFocus
          onFocus={(event) => event.target.select()}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={problem ? tripNameMessage(problem) : undefined}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit">Save</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
