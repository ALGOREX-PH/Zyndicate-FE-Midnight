import { cx } from "../../lib/format";

/**
 * The signature component (PRD 6.4): before any major action, show exactly
 * where each piece of information goes. Rendered as a "disclosure ledger" —
 * a ruled document with a visibility-class chip per row.
 */
export interface PrivacyPreviewProps {
  /** Never leaves this device (keys, salts, openings). */
  local: string[];
  /** Encrypted client-side before upload; host stores ciphertext only. */
  sealed: string[];
  /** Who receives access, and to what. */
  access: string[];
  /** Becomes public — written to the ledger, permanent. */
  publicFacts: string[];
  /** Private by default, openable to an authorized party later. */
  disclosable?: string[];
  className?: string;
}

interface RowSpec {
  chip: string;
  chipClass: string;
  heading: string;
  items: string[];
}

function Row({ chip, chipClass, heading, items }: RowSpec) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-2 border-t border-line px-4 py-3.5 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
      <div>
        <span
          className={cx(
            "inline-block rounded-[2px] border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em]",
            chipClass,
          )}
        >
          {chip}
        </span>
        <p className="mt-1 text-[11px] leading-tight text-dim">{heading}</p>
      </div>
      <ul className="space-y-1 text-sm text-bone sm:pt-0.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="mt-[7px] block h-px w-2 shrink-0 bg-line-strong" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrivacyPreview({
  local,
  sealed,
  access,
  publicFacts,
  disclosable = [],
  className,
}: PrivacyPreviewProps) {
  return (
    <section
      aria-label="Privacy preview"
      className={cx(
        "overflow-hidden rounded-[4px] border border-line-strong bg-ink",
        // double-rule document frame
        "shadow-[inset_0_0_0_4px_var(--color-ink),inset_0_0_0_5px_var(--color-line)]",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-4 px-4 py-3">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-bone">
          <span aria-hidden="true" className="mr-2 text-vio">
            ◈
          </span>
          Privacy preview
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
          Read before you commit
        </p>
      </header>

      <Row
        chip="Local"
        chipClass="border-line-strong text-bone"
        heading="Stays on this device"
        items={local}
      />
      <Row
        chip="Sealed"
        chipClass="border-vio/50 text-vio"
        heading="Encrypted before upload"
        items={sealed}
      />
      <Row
        chip="Access"
        chipClass="border-line-strong text-fog"
        heading="Who can open it"
        items={access}
      />
      <Row
        chip="Public"
        chipClass="border-amber/50 text-amber"
        heading="Becomes public — permanent"
        items={publicFacts}
      />
      <Row
        chip="May open"
        chipClass="border-danger/50 text-danger"
        heading="Disclosable if authorized later"
        items={disclosable}
      />

      <footer className="border-t border-line px-4 py-2.5">
        <p className="text-[11px] text-dim">
          Ledger writes are irreversible. Everything sealed stays unreadable without keys held on
          your device.
        </p>
      </footer>
    </section>
  );
}
