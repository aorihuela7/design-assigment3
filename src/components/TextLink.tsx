import Link from "next/link";
import type { ComponentProps } from "react";

// Underlined text actions. On their own line they're 44px tall; inside a sentence
// (inline) an invisible ::after gives the same 44px target without changing the
// line height, so the focus ring stays on the words.
const base = "rounded text-ink underline underline-offset-4 hover:decoration-2 active:text-muted";
const block = "inline-flex min-h-11 cursor-pointer items-center";
const inline =
  "relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']";

type TextLinkProps = ComponentProps<typeof Link> & { inline?: boolean };

export function TextLink({ inline: isInline = false, className = "", ...props }: TextLinkProps) {
  return <Link className={`${base} ${isInline ? inline : block} ${className}`} {...props} />;
}

// Looks like a link, but it acts within the page (for example, moving focus).
export function TextButton({ type = "button", className = "", ...props }: ComponentProps<"button">) {
  return <button type={type} className={`${base} ${block} ${className}`} {...props} />;
}
