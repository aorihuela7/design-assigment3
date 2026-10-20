import { useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SelectField, TextField } from "@/components/Field";
import { SECTIONS, type Item, type Section } from "@/lib/storage";
import { cleanName, itemNameError } from "@/lib/trips";

type AddItemFormProps = {
  items: Item[];
  onAdd: (name: string, section: Section) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

const sectionOptions = SECTIONS.map(({ value, label }) => ({ value, label }));

export function AddItemForm({ items, onAdd, inputRef }: AddItemFormProps) {
  const [name, setName] = useState("");
  // Last section picked on this page; Clothes on arrival. Not saved.
  const [section, setSection] = useState<Section>("clothes");
  // No errors before the first submit; after it, the error follows what's typed.
  const [attempted, setAttempted] = useState(false);
  const error = attempted ? itemNameError(name, items) : null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (itemNameError(name, items)) {
      setAttempted(true); // keeps exactly what was typed
      inputRef.current?.focus();
      return;
    }
    onAdd(cleanName(name), section);
    setName("");
    setAttempted(false);
    inputRef.current?.focus();
  }

  return (
    <Card>
      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <TextField
          ref={inputRef}
          label="Item name"
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)}
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
            Add item
          </Button>
        </div>
      </form>
    </Card>
  );
}
