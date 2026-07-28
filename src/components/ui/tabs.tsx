import { useRef } from "react";
import { cx } from "../../lib/format";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  "aria-label": string;
}

/** Accessible tablist with arrow-key navigation. */
export function Tabs({ tabs, value, onChange, "aria-label": ariaLabel }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const move = (delta: number) => {
    const index = tabs.findIndex((t) => t.id === value);
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    if (next) {
      onChange(next.id);
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]");
      buttons?.[(index + delta + tabs.length) % tabs.length]?.focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-1 border-b border-line"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          move(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          move(-1);
        }
      }}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cx(
              "-mb-px border-b-2 px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
              selected
                ? "border-vio text-bone"
                : "border-transparent text-fog hover:text-bone",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  id,
  active,
  children,
  className,
}: {
  id: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!active) return null;
  return (
    <div id={`panel-${id}`} role="tabpanel" aria-labelledby={`tab-${id}`} className={className}>
      {children}
    </div>
  );
}
