import { forwardRef } from "react";
import { AlertCircle, SearchX } from "lucide-react";
import { maskCNPJ } from "../utils/cnpj";

interface Props {
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  errorIcon: "alert" | "notfound";
  disabled?: boolean;
}

const CNPJInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, error, errorIcon, disabled }, ref) => {
    const Icon = errorIcon === "notfound" ? SearchX : AlertCircle;
    return (
      <div className="w-full">
        <label htmlFor="cnpj" className="mb-1.5 block text-sm font-medium">
          CNPJ
        </label>
        <input
          ref={ref}
          id="cnpj"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="00.000.000/0000-00"
          value={value}
          disabled={disabled}
          maxLength={18}
          aria-invalid={!!error}
          aria-describedby={error ? "cnpj-error" : undefined}
          onChange={(e) => onChange(maskCNPJ(e.target.value))}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-base text-black placeholder:text-muted/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 disabled:opacity-60 ${
            error ? "border-danger" : "border-line"
          }`}
        />
        {error && (
          <p
            id="cnpj-error"
            role="alert"
            className="fade-in mt-2 flex items-start gap-1.5 text-sm text-danger"
          >
            <Icon size={16} className="mt-0.5 shrink-0" aria-hidden />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

export default CNPJInput;
