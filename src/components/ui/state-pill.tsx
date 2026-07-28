import type { MandateState } from "../../api/schemas";
import { cx } from "../../lib/format";

type Tone = "neutral" | "vio" | "amber" | "phosphor" | "danger";

const tones: Record<Tone, string> = {
  neutral: "border-line-strong text-fog",
  vio: "border-vio/40 text-vio",
  amber: "border-amber/40 text-amber",
  phosphor: "border-phosphor/40 text-phosphor",
  danger: "border-danger/40 text-danger",
};

/**
 * One pill per mandate state — the label always carries the meaning
 * (never color alone).
 */
export const STATE_META: Record<MandateState, { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "neutral" },
  open_for_bids: { label: "Open for bids", tone: "vio" },
  bidding_closed: { label: "Bidding closed", tone: "amber" },
  awarded: { label: "Awarded", tone: "vio" },
  in_execution: { label: "In execution", tone: "amber" },
  submitted: { label: "Submitted", tone: "amber" },
  accepted: { label: "Accepted", tone: "phosphor" },
  settled: { label: "Settled", tone: "phosphor" },
  disputed: { label: "Disputed", tone: "danger" },
  resolved: { label: "Resolved", tone: "phosphor" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export function StatePill({ state, className }: { state: MandateState; className?: string }) {
  const meta = STATE_META[state] ?? STATE_META.draft;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]",
        tones[meta.tone],
        className,
      )}
    >
      <span aria-hidden="true" className="text-[8px] leading-none">
        ▪
      </span>
      {meta.label}
    </span>
  );
}

/** Generic badge with the same voice, for non-state labels. */
export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-[2px] border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
