import type { CSSProperties } from "react";

// The Departures plane, pointing right. Always decorative.
export function PlaneIcon({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style}>
      <path
        fill="currentColor"
        d="M22.5 12c0-.8-.7-1.3-1.5-1.3h-5.6L9.8 3H7.6l2.9 7.7H5.3L3.5 8.2H2l.9 3.8L2 15.8h1.5l1.8-2.5h5.2L7.6 21h2.2l5.6-7.7H21c.8 0 1.5-.5 1.5-1.3z"
      />
    </svg>
  );
}
