"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

// Label above, error directly below the control. One column.
export function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-wider text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm text-ink">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="currentColor" />
      <path d="M8 4v5" stroke="var(--color-surface)" strokeWidth="2" />
      <circle cx="8" cy="11.75" r="1.1" fill="var(--color-surface)" />
    </svg>
  );
}

// Invalid fields get a 2px border; padding shrinks by 1px so text doesn't shift.
const controlClass =
  "min-h-11 w-full rounded border border-muted bg-surface px-3 py-2 text-ink placeholder:text-muted enabled:hover:border-ink aria-invalid:border-2 aria-invalid:border-ink aria-invalid:px-[11px] aria-invalid:py-[7px] disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas disabled:text-muted";

function describedBy(id: string, error: string | undefined, own: string | undefined) {
  return [own, error ? `${id}-error` : undefined].filter(Boolean).join(" ") || undefined;
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, type = "text", className = "", ...props }: TextFieldProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error}>
      <input
        {...props}
        id={id}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, props["aria-describedby"])}
        className={`${controlClass} ${className}`}
      />
    </Field>
  );
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
};

export function SelectField({ label, error, options, className = "", ...props }: SelectFieldProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error}>
      <div className="relative">
        <select
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, props["aria-describedby"])}
          className={`${controlClass} cursor-pointer appearance-none pr-10 aria-invalid:pr-10 ${className}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink"
        >
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </Field>
  );
}
