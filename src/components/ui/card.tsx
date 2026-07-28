import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/format";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cx("hairline rounded-[4px] bg-panel", padded && "p-5", className)}
      {...rest}
    />
  );
}

export interface CardHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}

export function CardHeader({ eyebrow, title, aside, className }: CardHeaderProps) {
  return (
    <div className={cx("mb-4 flex items-start justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 className="font-display text-lg font-semibold text-bone">{title}</h2>
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
