export function validateEmail(email: string): boolean {
  const parts = email.split('@');

  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  if (!localPart || localPart.trim() === '') {
    return false;
  }

  if (!domain || !domain.includes('.')) {
    return false;
  }

  return true;
}
