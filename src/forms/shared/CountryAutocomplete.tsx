import type { InputHTMLAttributes } from 'react';
import { FieldError } from './FieldError';

interface CountryAutocompleteProps extends InputHTMLAttributes<HTMLInputElement> {
  countries: readonly string[];
  datalistId: string;
  error?: string;
}

export function CountryAutocomplete({
  countries,
  datalistId,
  error,
  id,
  className = 'field-input',
  ...inputProps
}: CountryAutocompleteProps) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        Country
      </label>
      <input
        id={id}
        className={className}
        list={datalistId}
        autoComplete="off"
        {...inputProps}
      />
      <datalist id={datalistId}>
        {countries.map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
      <FieldError message={error} />
    </div>
  );
}
