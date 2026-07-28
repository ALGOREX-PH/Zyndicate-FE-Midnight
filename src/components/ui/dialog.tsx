import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "../../lib/format";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}

/**
 * Modal built on the native <dialog> element: focus trap, Esc handling and
 * inert background come from the platform.
 */
export function Dialog({ open, onClose, title, children, wide = false }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        // click on the backdrop (the dialog element itself) closes
        if (e.target === ref.current) onClose();
      }}
      className={cx(
        "m-auto w-[calc(100vw-2rem)] rounded-[4px] border border-line-strong bg-panel p-0 text-bone shadow-2xl",
        "backdrop:bg-ink/85 backdrop:backdrop-blur-[2px]",
        wide ? "max-w-2xl" : "max-w-md",
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-fog">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="grid size-7 place-items-center rounded-[2px] text-fog transition-colors hover:text-bone"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
