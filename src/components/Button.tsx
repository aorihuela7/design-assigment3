import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const variants = {
  // Accent is reserved for the primary action.
  primary:
    "border-accent bg-accent text-white enabled:hover:border-accent-hover enabled:hover:bg-accent-hover enabled:active:border-accent-pressed enabled:active:bg-accent-pressed",
  secondary: "border-ink bg-surface text-ink enabled:hover:bg-canvas enabled:active:bg-line",
};

export function Button({ variant = "secondary", type = "button", className = "", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-mono text-sm uppercase tracking-wider disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas disabled:text-muted ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
