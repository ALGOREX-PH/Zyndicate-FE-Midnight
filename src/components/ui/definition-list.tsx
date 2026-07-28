import type { ReactNode } from "react";
import { cx } from "../../lib/format";
import { CopyButton } from "./copy-button";

export interface DefinitionItem {
  label: string;
  /** Plain value; ignored if `copy` is provided. */
  value?: ReactNode;
  /** Render as a middle-truncated copyable hash. */
  copy?: string;
  mono?: boolean;
}

/** Term/value rows with hairline separators — for commitments and metadata. */
export function DefinitionList({
  items,
  className,
}: {
  items: DefinitionItem[];
  className?: string;
}) {
  return (
    <dl className={cx("divide-y divide-line", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
        >
          <dt className="eyebrow shrink-0">{item.label}</dt>
          <dd className="min-w-0 text-right">
            {item.copy ? (
              <CopyButton value={item.copy} label={item.label} />
            ) : (
              <span className={cx("text-sm text-bone", item.mono && "font-mono text-xs")}>
                {item.value ?? "—"}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
