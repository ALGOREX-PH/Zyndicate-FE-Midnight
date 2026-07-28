import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cx } from "../../lib/format";

/* --------------------------------- Field ---------------------------------- */

export interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/** Label + control + hint/error wiring (aria-describedby handled by controls). */
export function Field({ label, htmlFor, error, hint, children, className }: FieldProps) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="eyebrow">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-dim">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const controlBase =
  "w-full rounded-[2px] border bg-ink px-3 text-sm text-bone placeholder:text-dim transition-colors focus:border-vio focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

function controlClasses(invalid: boolean, extra?: string) {
  return cx(controlBase, invalid ? "border-danger/60" : "border-line", extra);
}

/* --------------------------------- Input ---------------------------------- */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <input
      ref={ref}
      id={inputId}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${inputId}-error` : undefined}
      className={controlClasses(invalid, cx("h-10", className))}
      {...rest}
    />
  );
});

/* -------------------------------- Textarea -------------------------------- */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, className, id, rows = 4, ...rest },
  ref,
) {
  const autoId = useId();
  const areaId = id ?? autoId;
  return (
    <textarea
      ref={ref}
      id={areaId}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${areaId}-error` : undefined}
      className={controlClasses(invalid, cx("py-2", className))}
      {...rest}
    />
  );
});

/* --------------------------------- Select --------------------------------- */

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid = false, className, id, children, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <select
      ref={ref}
      id={selectId}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${selectId}-error` : undefined}
      className={controlClasses(invalid, cx("h-10 appearance-none", className))}
      {...rest}
    >
      {children}
    </select>
  );
});
