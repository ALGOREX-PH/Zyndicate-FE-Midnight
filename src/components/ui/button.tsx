import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../../lib/format";

export type ButtonVariant = "primary" | "secondary" | "proof" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "border-bone bg-bone text-ink hover:bg-white hover:border-white",
  secondary: "border-line-strong bg-transparent text-bone hover:border-fog",
  proof: "border-phosphor/50 bg-phosphor/10 text-phosphor hover:bg-phosphor/20",
  danger: "border-danger/50 bg-transparent text-danger hover:bg-danger/10",
  ghost: "border-transparent bg-transparent text-fog hover:text-bone",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3",
  md: "h-10 px-5",
};

/** Buttons speak in the terminal voice: mono, uppercase, letterspaced. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading = false, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-[2px] border font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-3 animate-spin rounded-full border border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
});
