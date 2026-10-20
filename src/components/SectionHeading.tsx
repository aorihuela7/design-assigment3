import type { ComponentProps } from "react";

// The h2 used for every section of a page, under the Departures header's h1.
export function SectionHeading({ className = "", ...props }: ComponentProps<"h2">) {
  return <h2 className={`font-display text-2xl font-semibold uppercase tracking-wide ${className}`} {...props} />;
}
