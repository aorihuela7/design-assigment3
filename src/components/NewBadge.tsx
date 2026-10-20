type NewBadgeProps = {
  children?: string;
};

export function NewBadge({ children = "New" }: NewBadgeProps) {
  return (
    <span className="inline-block border border-ink px-1.5 py-0.5 font-mono text-xs leading-none uppercase tracking-wider text-ink">
      {children}
    </span>
  );
}
