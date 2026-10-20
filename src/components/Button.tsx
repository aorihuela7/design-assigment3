import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-mono text-sm uppercase tracking-wider";

const variants = {
  // Accent is reserved for the primary action.
  primary:
    "border-accent bg-accent text-white enabled:hover:border-accent-hover enabled:hover:bg-accent-hover enabled:active:border-accent-pressed enabled:active:bg-accent-pressed",
  secondary: "border-ink bg-surface text-ink enabled:hover:bg-canvas enabled:active:bg-line",
  // For repeated row actions: no border until hovered, so lists stay calm.
  quiet: "border-transparent bg-transparent text-ink enabled:hover:border-ink enabled:active:bg-line",
};

// Links can't be disabled, so they only need hover and pressed.
const linkVariants = {
  primary:
    "border-accent bg-accent text-white hover:border-accent-hover hover:bg-accent-hover active:border-accent-pressed active:bg-accent-pressed",
  secondary: "border-ink bg-surface text-ink hover:bg-canvas active:bg-line",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "secondary", type = "button", className = "", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas disabled:text-muted ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

// A link that looks like a button, for actions that go to another page.
type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: keyof typeof linkVariants };

export function ButtonLink({ variant = "secondary", className = "", ...props }: ButtonLinkProps) {
  return <Link className={`${base} ${linkVariants[variant]} ${className}`} {...props} />;
}
