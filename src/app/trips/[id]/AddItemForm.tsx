import { useId, useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SelectField, TextField } from "@/components/Field";
import { SECTIONS, type Item, type Section } from "@/lib/storage";
import { cleanName, itemNameError } from "@/lib/trips";

type AddItemFormProps = {
  items: Item[];
  onAdd: (name: string, section: Section) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  // The list is fully packed: what's added now is for next time.
  forgotMode: boolean;
};

const sectionOptions = SECTIONS.map(({ value, label }) => ({ value, label }));

export function AddItemForm({ items, onAdd, inputRef, forgotMode }: AddItemFormProps) {
  const headingId = useId();
  const [name, setName] = useState("");
  // Last section picked on this page; Clothes on arrival. Not saved.
  const [section, setSection] = useState<Section>("clothes");
  // No errors before the first submit; after it, the error follows what's typed. It
  // belongs to the mode it was made in, so switching to "Forgot something?" clears it.
  const [attemptedIn, setAttemptedIn] = useState<boolean | null>(null);
  const error = attemptedIn === forgotMode ? itemNameError(name, items) : null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (itemNameError(name, items)) {
      setAttemptedIn(forgotMode); // keeps exactly what was typed
      inputRef.current?.focus();
      return;
    }
    onAdd(cleanName(name), section);
    setName("");
    setAttemptedIn(null);
    inputRef.current?.focus();
  }

  return (
    <Card>
      <form noValidate onSubmit={submit} aria-labelledby={headingId} className="flex flex-col gap-4">
        <h2 id={headingId} className="font-display text-2xl font-semibold uppercase tracking-wide">
          {forgotMode ? "Forgot something?" : "Add an item"}
        </h2>
        <TextField
          ref={inputRef}
          label="Item name"
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)}
          // Leaving an empty field drops its error; nothing is left to fix.
          onBlur={() => {
            if (cleanName(name) === "") setAttemptedIn(null);
          }}
          error={error ?? undefined}
        />
        <SelectField
          label="Section"
          options={sectionOptions}
          value={section}
          onChange={(event) => setSection(event.target.value as Section)}
        />
        <div>
          <Button type="submit" variant="primary">
            {forgotMode ? "Add it for next time" : "Add item"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
