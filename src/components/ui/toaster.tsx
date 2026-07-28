import { useToastStore, type ToastTone } from "../../store/toast";
import { cx } from "../../lib/format";

const toneStyles: Record<ToastTone, string> = {
  info: "border-line-strong",
  success: "border-phosphor/50",
  danger: "border-danger/50",
};

const toneLabels: Record<ToastTone, string> = {
  info: "Notice",
  success: "Confirmed",
  danger: "Failed",
};

const toneText: Record<ToastTone, string> = {
  info: "text-fog",
  success: "text-phosphor",
  danger: "text-danger",
};

/** Fixed toast stack, bottom-right. Mount once in the app shell. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-100 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === "danger" ? "alert" : "status"}
          className={cx(
            "pointer-events-auto rounded-[4px] border bg-raise p-3.5 shadow-xl",
            toneStyles[t.tone],
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={cx(
                  "font-mono text-[10px] font-medium uppercase tracking-[0.16em]",
                  toneText[t.tone],
                )}
              >
                {toneLabels[t.tone]}
              </p>
              <p className="mt-1 text-sm text-bone">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-fog">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-fog transition-colors hover:text-bone"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
