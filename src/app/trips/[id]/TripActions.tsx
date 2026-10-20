import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
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
};

// The bottom of the list: Clear all ticks and Rename trip. Renaming opens a form
// in place (not a modal); Escape or Cancel closes it and focus goes back.
export function TripActions({ trip, otherTrips, packed, onClearTicks, onRename }: TripActionsProps) {
  const [renaming, setRenaming] = useState(false);
  const renameButton = useRef<HTMLButtonElement>(null);

  const close = () => {
    setRenaming(false);
    requestAnimationFrame(() => renameButton.current?.focus());
  };

  if (renaming) {
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
      <Button ref={renameButton} onClick={() => setRenaming(true)}>
        Rename trip
      </Button>
    </div>
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
          <Button type="submit">Save name</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
