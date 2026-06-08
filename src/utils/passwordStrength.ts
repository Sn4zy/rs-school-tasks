export interface PasswordStrengthChecks {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialCharacter: boolean;
}

export function getPasswordStrength(password: string): PasswordStrengthChecks {
  let hasNumber = false;
  let hasUppercase = false;
  let hasLowercase = false;
  let hasSpecialCharacter = false;

  for (const character of password) {
    if (character >= '0' && character <= '9') {
      hasNumber = true;
    } else if (character >= 'A' && character <= 'Z') {
      hasUppercase = true;
    } else if (character >= 'a' && character <= 'z') {
      hasLowercase = true;
    } else {
      hasSpecialCharacter = true;
    }
  }

  return {
    hasNumber,
    hasUppercase,
    hasLowercase,
    hasSpecialCharacter,
  };
}
