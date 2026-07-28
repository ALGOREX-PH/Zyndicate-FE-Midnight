import type { ReactNode } from "react";
import { cx } from "../../lib/format";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** An empty screen is an invitation to act — say what to do next. */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center rounded-[4px] border border-dashed border-line-strong px-6 py-12 text-center",
        className,
      )}
    >
      <span aria-hidden="true" className="mb-3 font-mono text-lg text-dim">
        ◇
      </span>
      <p className="font-display text-base font-semibold text-bone">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-fog">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
