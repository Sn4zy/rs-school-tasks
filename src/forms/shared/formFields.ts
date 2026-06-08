import type { Gender } from '../../types/submission';

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const TERMS_LABEL = 'I accept the Terms and Conditions';

export function createFieldIds(prefix: string) {
  return {
    name: `${prefix}-name`,
    age: `${prefix}-age`,
    email: `${prefix}-email`,
    gender: (value: Gender) => `${prefix}-gender-${value}`,
    acceptedTerms: `${prefix}-accepted-terms`,
  };
}
