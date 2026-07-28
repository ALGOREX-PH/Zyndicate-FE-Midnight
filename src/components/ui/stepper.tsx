import { cx } from "../../lib/format";

export type StepStatus = "done" | "current" | "upcoming" | "halt";

export interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

const glyphs: Record<StepStatus, string> = {
  done: "✓",
  current: "●",
  upcoming: "○",
  halt: "✕",
};

const glyphTone: Record<StepStatus, string> = {
  done: "text-phosphor border-phosphor/50",
  current: "text-vio border-vio/60",
  upcoming: "text-dim border-line-strong",
  halt: "text-danger border-danger/50",
};

const labelTone: Record<StepStatus, string> = {
  done: "text-fog",
  current: "text-bone",
  upcoming: "text-dim",
  halt: "text-danger",
};

/**
 * Lifecycle stepper. Status is carried by glyph + label styling, and exposed
 * to assistive tech via aria-current / visually hidden status text.
 */
export function Stepper({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cx("flex flex-wrap items-center gap-y-3", className)}>
      {steps.map((step, i) => (
        <li
          key={step.id}
          aria-current={step.status === "current" ? "step" : undefined}
          className="flex items-center"
        >
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cx(
                "grid size-5 shrink-0 place-items-center rounded-full border text-[9px]",
                glyphTone[step.status],
              )}
            >
              {glyphs[step.status]}
            </span>
            <span
              className={cx(
                "font-mono text-[10px] font-medium uppercase tracking-[0.1em] whitespace-nowrap",
                labelTone[step.status],
              )}
            >
              {step.label}
              <span className="sr-only">
                {step.status === "done" && " — complete"}
                {step.status === "current" && " — current stage"}
                {step.status === "halt" && " — halted"}
              </span>
            </span>
          </span>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="mx-2 h-px w-4 bg-line-strong sm:w-6" />
          )}
        </li>
      ))}
    </ol>
  );
}
