import { getPasswordStrength } from '../../utils/passwordStrength';
import './PasswordStrengthIndicator.css';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const REQUIREMENTS = [
  { key: 'hasNumber', label: '1 number' },
  { key: 'hasUppercase', label: '1 uppercase letter' },
  { key: 'hasLowercase', label: '1 lowercase letter' },
  { key: 'hasSpecialCharacter', label: '1 special character' },
] as const;

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const checks = getPasswordStrength(password);

  return (
    <ul className="password-strength" aria-label="Password strength requirements">
      {REQUIREMENTS.map((requirement) => {
        const isMet = checks[requirement.key];

        return (
          <li key={requirement.key} className={isMet ? 'password-strength-met' : ''}>
            {requirement.label}
          </li>
        );
      })}
    </ul>
  );
}
