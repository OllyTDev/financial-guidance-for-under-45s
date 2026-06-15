import { cn } from "@/lib/utils";

interface RadioOptionProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
}: RadioOptionProps) {
  const id = `${name}-${value}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm text-sand-800 transition-colors",
        checked
          ? "border-sand-800 bg-cream-100"
          : "border-sand-700/15 bg-white hover:bg-cream-50",
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 border-sand-700/30 text-sand-800 focus:ring-sand-800"
      />
      <span>{label}</span>
    </label>
  );
}

interface RadioGroupProps {
  name: string;
  legend?: React.ReactNode;
  ariaLabel?: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({
  name,
  legend,
  ariaLabel,
  options,
  value,
  onChange,
  className,
}: RadioGroupProps) {
  return (
    <fieldset
      className={cn("space-y-3", className)}
      aria-label={legend ? undefined : ariaLabel}
    >
      {legend ? (
        <legend className="text-sm font-medium text-sand-800">{legend}</legend>
      ) : null}
      <div className="space-y-2">
        {options.map((option) => (
          <RadioOption
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
    </fieldset>
  );
}
