import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  hideLabel?: boolean;
  trailing?: ReactNode;
  children: (ariaIds: { describedBy: string | undefined }) => ReactNode;
}

function FieldShell({ id, label, hint, error, required, hideLabel, trailing, children }: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={[
          "block text-sm font-bold text-slate-900 ml-1",
          hideLabel ? "sr-only" : "",
        ].join(" ")}
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger ml-0.5">
            *
          </span>
        ) : null}
      </label>
      <div className="relative">
        {children({ describedBy })}
        {trailing ? <div className="absolute right-4 top-1/2 -translate-y-1/2">{trailing}</div> : null}
      </div>
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted ml-1">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-danger font-medium ml-1">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const baseControl =
  "w-full px-6 py-4 bg-slate-50 border rounded-card focus:outline-none focus:ring-4 focus:bg-white transition-[background-color,border-color,box-shadow] duration-300 placeholder:text-slate-400";

const stateControl = (hasError: boolean) =>
  hasError
    ? "border-danger focus:ring-danger/10 focus:border-danger"
    : "border-slate-200 focus:ring-accent/10 focus:border-accent";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  id?: string;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel, id, required, className = "", trailing, ...rest },
  ref
) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      trailing={trailing}
    >
      {({ describedBy }) => (
        <input
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[baseControl, stateControl(Boolean(error)), trailing ? "pr-12" : "", className]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      )}
    </FieldShell>
  );
});

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  id?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, hideLabel, id, required, className = "", ...rest },
  ref
) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
    >
      {({ describedBy }) => (
        <textarea
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[baseControl, stateControl(Boolean(error)), "resize-none", className]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      )}
    </FieldShell>
  );
});
