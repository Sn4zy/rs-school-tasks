import { useId, useState, type InputHTMLAttributes } from 'react';
import { FieldError } from './FieldError';

interface PasswordFieldProps {
  id: string;
  label: string;
  error?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export function PasswordField({ id, label, error, inputProps }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleId = useId();

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="password-field-wrapper">
        <input
          id={id}
          className="field-input password-field-input"
          autoComplete="new-password"
          {...inputProps}
          type={isVisible ? 'text' : 'password'}
        />
        <button
          id={toggleId}
          type="button"
          className="password-toggle"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-controls={id}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      <FieldError message={error} />
    </div>
  );
}
