import { useState } from "react";
import { cx, truncateMiddle } from "../../lib/format";

export interface CopyButtonProps {
  value: string;
  /** Accessible name for what is being copied, e.g. "mandate commitment". */
  label: string;
  /** Show the value truncated through the middle next to the button. */
  showValue?: boolean;
  className?: string;
}

/** Middle-truncated hash display + one-tap copy, in the mono voice. */
export function CopyButton({ value, label, showValue = true, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — selection fallback below */
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <span className={cx("inline-flex min-w-0 items-center gap-2", className)}>
      {showValue && (
        <code
          className="truncate font-mono text-xs text-fog"
          title={value}
        >
          {truncateMiddle(value)}
        </code>
      )}
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        className={cx(
          "shrink-0 rounded-[2px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
          copied
            ? "border-phosphor/50 text-phosphor"
            : "border-line-strong text-fog hover:text-bone",
        )}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
